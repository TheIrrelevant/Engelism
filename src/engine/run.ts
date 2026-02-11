import type { EngelProvider } from './provider-types'
import { PROVIDER_ID } from './provider-types'
import { resolveConfig } from './provider-config'
import { ENGEL_PROTOCOL_SCHEMA } from './response-schema'
import { fileToBase64 } from './utils'
import { geminiProvider } from './providers/gemini'
import { openaiProvider } from './providers/openai'
import { anthropicProvider } from './providers/anthropic'

const SYSTEM_INSTRUCTION = [
  'ROLE: Professional Architectural Photographer with expertise in multi-angle documentation.',
  '',
  'OBJECTIVE: Analyze the reference architectural image and generate a precise camera override protocol',
  'that will recreate the EXACT SAME building/structure from a different camera position and framing.',
  '',
  'CRITICAL RULES:',
  '1. BUILDING IDENTITY: The structure\'s design, materials, colors, and architectural character MUST remain 100% identical',
  '2. CONSISTENCY ANCHORS: Extract and preserve key identifying features (materials, textures, colors, proportions)',
  '3. SPATIAL UNDERSTANDING: Understand the 3D form to accurately predict how it appears from the new angle',
  '4. NO HALLUCINATION: Do not invent architectural features not present in the reference',
  '5. TECHNICAL ACCURACY: Apply the specified camera angle, framing, and lens characteristics precisely',
].join('\n')

const PROVIDERS: Record<string, EngelProvider> = {
  [PROVIDER_ID.Gemini]: geminiProvider,
  [PROVIDER_ID.OpenAI]: openaiProvider,
  [PROVIDER_ID.Anthropic]: anthropicProvider,
}

export async function runEngelEngine(prompt: string, imageFile: File): Promise<string> {
  const config = resolveConfig()
  const provider = PROVIDERS[config.providerId]

  if (!provider) {
    throw new Error(`Unknown provider: "${config.providerId}"`)
  }

  const imageBase64 = await fileToBase64(imageFile)

  return provider.generate(
    {
      systemInstruction: SYSTEM_INSTRUCTION,
      prompt,
      imageBase64,
      imageMimeType: imageFile.type,
      schema: ENGEL_PROTOCOL_SCHEMA,
      temperature: 0.1,
    },
    config,
  )
}
