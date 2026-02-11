import type { EngelProvider, EngelRequest, ProviderConfig } from '../provider-types'
import type { EngelResponseSchema } from '../response-schema'

// Convert our schema to Gemini's format
function toGeminiSchema(schema: EngelResponseSchema): Record<string, unknown> {
  const result: Record<string, unknown> = { type: schema.type.toUpperCase() }
  if (schema.properties) {
    result.properties = Object.fromEntries(
      Object.entries(schema.properties).map(([k, v]) => [k, toGeminiSchema(v)])
    )
  }
  if (schema.required) result.required = schema.required
  // Gemini does not support additionalProperties — omit it
  if (schema.items) result.items = toGeminiSchema(schema.items)
  if (schema.enum) result.enum = schema.enum
  return result
}

export const geminiProvider: EngelProvider = {
  name: 'Gemini',

  async generate(request: EngelRequest, config: ProviderConfig): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`

    const body = {
      systemInstruction: { parts: [{ text: request.systemInstruction }] },
      contents: [{
        parts: [
          { text: request.prompt },
          { inlineData: { mimeType: request.imageMimeType, data: request.imageBase64 } },
        ],
      }],
      generationConfig: {
        temperature: request.temperature,
        responseMimeType: 'application/json',
        responseSchema: toGeminiSchema(request.schema),
      },
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Gemini API error (${res.status}): ${err}`)
    }

    const data = await res.json()
    return data.candidates[0].content.parts[0].text
  },
}
