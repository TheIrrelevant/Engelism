import { PROVIDER_ID } from './provider-types'
import type { ProviderId, ProviderConfig } from './provider-types'

const DEFAULT_MODELS: Record<ProviderId, string> = {
  [PROVIDER_ID.Gemini]: 'gemini-3-flash-preview',
  [PROVIDER_ID.OpenAI]: 'gpt-4o',
  [PROVIDER_ID.Anthropic]: 'claude-sonnet-4-5-20250929',
}

const KEY_ENV_VARS: Record<ProviderId, string> = {
  [PROVIDER_ID.Gemini]: 'VITE_GOOGLE_API_KEY',
  [PROVIDER_ID.OpenAI]: 'VITE_OPENAI_API_KEY',
  [PROVIDER_ID.Anthropic]: 'VITE_ANTHROPIC_API_KEY',
}

function isRealKey(key: string | undefined): key is string {
  if (!key) return false
  const lower = key.toLowerCase()
  if (lower.includes('your_key') || lower.includes('your-key') || lower === 'xxx') return false
  return key.length >= 10
}

function detectProvider(env: Record<string, string>): { providerId: ProviderId; apiKey: string } {
  // 1. Check explicit provider override
  const explicit = env.VITE_PROVIDER as string | undefined
  if (explicit) {
    const providerId = explicit as ProviderId
    if (!Object.values(PROVIDER_ID).includes(providerId)) {
      throw new Error(`Invalid VITE_PROVIDER: "${explicit}". Must be one of: ${Object.values(PROVIDER_ID).join(', ')}`)
    }
    const key = env[KEY_ENV_VARS[providerId]]
    if (!isRealKey(key)) {
      throw new Error(`VITE_PROVIDER set to "${providerId}" but ${KEY_ENV_VARS[providerId]} is missing or invalid`)
    }
    return { providerId, apiKey: key }
  }

  // 2. Auto-detect: first available REAL key wins
  const order: ProviderId[] = [PROVIDER_ID.Gemini, PROVIDER_ID.OpenAI, PROVIDER_ID.Anthropic]
  for (const id of order) {
    const key = env[KEY_ENV_VARS[id]]
    if (isRealKey(key)) return { providerId: id, apiKey: key }
  }

  throw new Error(
    'No API key found. Set VITE_GOOGLE_API_KEY, VITE_OPENAI_API_KEY, or VITE_ANTHROPIC_API_KEY in .env'
  )
}

export function resolveConfig(): ProviderConfig {
  const env = import.meta.env as Record<string, string>
  const { providerId, apiKey } = detectProvider(env)
  const model = env.VITE_MODEL || DEFAULT_MODELS[providerId]

  return { providerId, model, apiKey }
}
