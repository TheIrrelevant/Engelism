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

function detectProvider(env: Record<string, string>): { providerId: ProviderId; apiKey: string } {
  // 1. Check explicit provider override
  const explicit = env.VITE_PROVIDER as ProviderId | undefined
  if (explicit && PROVIDER_ID[explicit as keyof typeof PROVIDER_ID]) {
    const key = env[KEY_ENV_VARS[explicit]]
    if (key) return { providerId: explicit, apiKey: key }
  }

  // 2. Auto-detect: first available key wins
  const order: ProviderId[] = [PROVIDER_ID.Gemini, PROVIDER_ID.OpenAI, PROVIDER_ID.Anthropic]
  for (const id of order) {
    const key = env[KEY_ENV_VARS[id]]
    if (key) return { providerId: id, apiKey: key }
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
