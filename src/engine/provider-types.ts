import type { EngelResponseSchema } from './response-schema'

export interface EngelRequest {
  systemInstruction: string
  prompt: string
  imageBase64: string
  imageMimeType: string
  schema: EngelResponseSchema
  temperature: number
}

export interface EngelProvider {
  readonly name: string
  generate(request: EngelRequest, config: ProviderConfig): Promise<string>
}

export const PROVIDER_ID = {
  Gemini: 'gemini',
  OpenAI: 'openai',
  Anthropic: 'anthropic',
} as const

export type ProviderId = (typeof PROVIDER_ID)[keyof typeof PROVIDER_ID]

export interface ProviderConfig {
  providerId: ProviderId
  model: string
  apiKey: string
}
