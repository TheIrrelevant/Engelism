import type { EngelProvider, EngelRequest, ProviderConfig } from '../provider-types'

export const anthropicProvider: EngelProvider = {
  name: 'Anthropic',

  async generate(request: EngelRequest, config: ProviderConfig): Promise<string> {
    const isBrowser = 'window' in globalThis
    const base = isBrowser ? '/api/anthropic' : 'https://api.anthropic.com'
    const url = `${base}/v1/messages`

    const body = {
      model: config.model,
      max_tokens: 4096,
      temperature: request.temperature,
      system: request.systemInstruction,
      tools: [{
        name: 'camera_override_protocol',
        description: 'Output the camera override protocol as structured JSON',
        input_schema: request.schema,
      }],
      tool_choice: { type: 'tool', name: 'camera_override_protocol' },
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: request.prompt },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: request.imageMimeType,
              data: request.imageBase64,
            },
          },
        ],
      }],
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Anthropic API error (${res.status}): ${err}`)
    }

    const data = await res.json()
    const toolBlock = data.content?.find((b: { type: string }) => b.type === 'tool_use')
    if (!toolBlock?.input) {
      throw new Error('Anthropic response missing tool_use block with input')
    }
    return JSON.stringify(toolBlock.input, null, 2)
  },
}
