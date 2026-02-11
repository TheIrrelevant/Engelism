import type { EngelProvider, EngelRequest, ProviderConfig } from '../provider-types'

export const openaiProvider: EngelProvider = {
  name: 'OpenAI',

  async generate(request: EngelRequest, config: ProviderConfig): Promise<string> {
    const url = '/api/openai/v1/chat/completions'  // Proxied via Vite

    const body = {
      model: config.model,
      temperature: request.temperature,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'camera_override_protocol',
          strict: true,
          schema: request.schema,
        },
      },
      messages: [
        { role: 'system', content: request.systemInstruction },
        {
          role: 'user',
          content: [
            { type: 'text', text: request.prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:${request.imageMimeType};base64,${request.imageBase64}`,
              },
            },
          ],
        },
      ],
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`OpenAI API error (${res.status}): ${err}`)
    }

    const data = await res.json()
    return data.choices[0].message.content
  },
}
