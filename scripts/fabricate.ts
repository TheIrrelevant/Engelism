/**
 * Engelism Fabrication — Cross-product batch protocol generator.
 *
 * Takes ONE reference image (auto-saved by UI) and generates protocols for every
 * Camera Angle × Shot Scale combination. Lens + Aspect Ratio stay fixed (from config).
 *
 * Usage:
 *   npm run fabrication                          # reads from auto-saved config + image
 *   npm run fabrication -- --concurrency 5       # override concurrency
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

// Engine imports
import type { EngelProvider, ProviderConfig, ProviderId } from '../src/engine/provider-types.js'
import { PROVIDER_ID } from '../src/engine/provider-types.js'
import { ENGEL_PROTOCOL_SCHEMA } from '../src/engine/response-schema.js'
import { geminiProvider } from '../src/engine/providers/gemini.js'
import { openaiProvider } from '../src/engine/providers/openai.js'
import { anthropicProvider } from '../src/engine/providers/anthropic.js'

// Type imports
import type { BatchConfig } from '../src/types/batch-config.js'
import type { Library } from '../src/types/library.js'

// ── Helpers ──────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

function loadEnv(): Record<string, string> {
  const envPath = resolve(ROOT, '.env')
  if (!existsSync(envPath)) return {}
  const env: Record<string, string> = {}
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 0) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim()
    env[key] = val
  }
  return env
}

function resolveProvider(env: Record<string, string>): { provider: EngelProvider; config: ProviderConfig } {
  const providers: Record<string, EngelProvider> = {
    [PROVIDER_ID.Gemini]: geminiProvider,
    [PROVIDER_ID.OpenAI]: openaiProvider,
    [PROVIDER_ID.Anthropic]: anthropicProvider,
  }

  const keyVars: Record<string, string> = {
    [PROVIDER_ID.Gemini]: 'VITE_GOOGLE_API_KEY',
    [PROVIDER_ID.OpenAI]: 'VITE_OPENAI_API_KEY',
    [PROVIDER_ID.Anthropic]: 'VITE_ANTHROPIC_API_KEY',
  }

  const defaultModels: Record<string, string> = {
    [PROVIDER_ID.Gemini]: 'gemini-3-flash-preview',
    [PROVIDER_ID.OpenAI]: 'gpt-4o',
    [PROVIDER_ID.Anthropic]: 'claude-sonnet-4-5-20250929',
  }

  // Explicit provider
  const explicit = env.VITE_PROVIDER as ProviderId | undefined
  if (explicit && providers[explicit]) {
    const key = env[keyVars[explicit]]
    if (key && key.length >= 10 && !key.toLowerCase().includes('your_key')) {
      return {
        provider: providers[explicit],
        config: { providerId: explicit, model: env.VITE_MODEL || defaultModels[explicit], apiKey: key },
      }
    }
  }

  // Auto-detect
  for (const id of [PROVIDER_ID.Gemini, PROVIDER_ID.OpenAI, PROVIDER_ID.Anthropic] as ProviderId[]) {
    const key = env[keyVars[id]]
    if (key && key.length >= 10 && !key.toLowerCase().includes('your_key')) {
      return {
        provider: providers[id],
        config: { providerId: id, model: env.VITE_MODEL || defaultModels[id], apiKey: key },
      }
    }
  }

  throw new Error('No API key found in .env')
}

function imageToBase64(path: string): { data: string; mimeType: string } {
  const ext = extname(path).toLowerCase()
  const mimeMap: Record<string, string> = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.png': 'image/png', '.webp': 'image/webp',
  }
  const mimeType = mimeMap[ext] ?? 'image/jpeg'
  const data = readFileSync(path).toString('base64')
  return { data, mimeType }
}

// ── Prompt builder (standalone for CLI) ─────────────────────────────

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

function buildFabricationPrompt(
  angleKey: string, scaleKey: string, lensKey: string, ratio: string,
  lib: Library,
): string {
  const angleDesc = lib.camera_angles[angleKey]?.prompt_text ?? ''
  const scaleDesc = lib.shot_scales[scaleKey]?.prompt_text ?? ''
  const lensDesc = lib.lenses[lensKey]?.prompt_text ?? ''

  return [
    'REFERENCE IMAGE ANALYSIS TASK:',
    'You are viewing an architectural photograph. Your task is to generate a camera override protocol',
    'that will recreate this EXACT structure from a different viewpoint.',
    '',
    'NEW CAMERA SPECIFICATIONS:',
    '',
    '1. CAMERA ANGLE OVERRIDE:',
    angleDesc,
    '',
    '2. SHOT SCALE/FRAMING:',
    scaleDesc,
    '',
    '3. LENS OPTICAL CHARACTER:',
    lensDesc,
    '',
    `4. ASPECT RATIO: ${ratio}`,
    '',
    'REQUIRED OUTPUT STRUCTURE (JSON):',
    '{',
    '  "camera_override_protocol": "Explicit command describing how the camera position changes from the reference to achieve the new angle.",',
    '  "volumetric_reconstruction": "Detailed description of how the building\'s 3D form will appear from the new angle.",',
    '  "consistency_anchors": "List of specific architectural features that MUST remain identical.",',
    '  "framing_boundaries": "Precise description of what should be included in the frame based on the shot scale.",',
    '  "optical_physics": "Explanation of how the specified lens will render the scene.",',
    '  "final_technical_prompt": "A complete, production-ready technical prompt that synthesizes all above elements."',
    '}',
    '',
    'CONSISTENCY REMINDER: The building\'s architectural identity must be preserved with 90-95% fidelity.',
    'Only the camera position, framing, and optical rendering change - NOT the building design itself.',
  ].join('\n')
}

// ── Concurrent pool ─────────────────────────────────────────────────

interface Task {
  angleKey: string
  scaleKey: string
  label: string
}

async function runPool(
  tasks: Task[],
  concurrency: number,
  worker: (task: Task, index: number) => Promise<void>,
) {
  let cursor = 0
  let done = 0
  const total = tasks.length

  async function next(): Promise<void> {
    while (cursor < total) {
      const idx = cursor++
      const task = tasks[idx]
      try {
        await worker(task, idx)
        done++
        console.log(`  [${done}/${total}] ✓ ${task.label}`)
      } catch (err) {
        done++
        console.log(`  [${done}/${total}] ✗ ${task.label} — ${(err as Error).message}`)
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, total) }, () => next()))
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)

  // Parse args
  let configPath = resolve(ROOT, 'engelism-config.json')
  let concurrency = 3

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--config' && args[i + 1]) { configPath = resolve(args[++i]); continue }
    if (args[i] === '--concurrency' && args[i + 1]) { concurrency = Math.max(1, Math.min(10, Number(args[++i]))); continue }
  }

  // Load config (auto-saved by UI via Vite middleware)
  if (!existsSync(configPath)) {
    console.error(`Config not found: ${configPath}`)
    console.error('Open Engelism UI, upload an image, select settings, and click "Save Config" first.')
    process.exit(1)
  }

  const config: BatchConfig = JSON.parse(readFileSync(configPath, 'utf-8'))

  // Resolve image path from config
  const imagePath = resolve(ROOT, config.referenceImage)
  if (!existsSync(imagePath)) {
    console.error(`Reference image not found: ${imagePath}`)
    console.error('Click "Save Config" in the UI to save the reference image.')
    process.exit(1)
  }

  console.log(`\n╔══ ENGELISM FABRICATION ══╗`)
  console.log(`  Lens: ${config.lens}`)
  console.log(`  Aspect Ratio: ${config.aspectRatio}`)
  console.log(`  Image: ${config.referenceImage}`)
  console.log(`  Concurrency: ${concurrency}`)

  // Load env + provider
  const env = loadEnv()
  const { provider, config: providerConfig } = resolveProvider(env)
  console.log(`  Provider: ${provider.name} (${providerConfig.model})`)

  // Load library
  const libPath = resolve(ROOT, 'src/data/library.json')
  const lib: Library = JSON.parse(readFileSync(libPath, 'utf-8'))

  // Read image
  const { data: imageBase64, mimeType: imageMimeType } = imageToBase64(imagePath)

  // Build cross-product: all angles × all scales
  const angleKeys = Object.keys(lib.camera_angles)
  const scaleKeys = Object.keys(lib.shot_scales)
  const lensLabel = lib.lenses[config.lens]?.ui_label ?? config.lens

  const tasks: Task[] = []
  for (const aKey of angleKeys) {
    for (const sKey of scaleKeys) {
      const aLabel = lib.camera_angles[aKey].ui_label
      const sLabel = lib.shot_scales[sKey].ui_label
      tasks.push({ angleKey: aKey, scaleKey: sKey, label: `${aLabel}-${sLabel}-${lensLabel}` })
    }
  }

  console.log(`  Combinations: ${tasks.length} (${angleKeys.length} angles × ${scaleKeys.length} scales)`)
  console.log(`╚═════════════════════════╝\n`)

  // Output directory
  const outDir = resolve(ROOT, 'Protocols')
  mkdirSync(outDir, { recursive: true })

  // Run pool
  let success = 0
  let fail = 0

  await runPool(tasks, concurrency, async (task) => {
    const prompt = buildFabricationPrompt(task.angleKey, task.scaleKey, config.lens, config.aspectRatio, lib)

    const result = await provider.generate(
      {
        systemInstruction: SYSTEM_INSTRUCTION,
        prompt,
        imageBase64,
        imageMimeType,
        schema: ENGEL_PROTOCOL_SCHEMA,
        temperature: 0.1,
      },
      providerConfig,
    )

    const outFile = resolve(outDir, `${task.label}.json`)
    writeFileSync(outFile, result, 'utf-8')
    success++
  })

  fail = tasks.length - success
  console.log(`\n══ Done: ${success} success, ${fail} failed ══`)
  console.log(`Output: ${outDir}`)
}

main().catch((err) => {
  console.error('Fabrication failed:', err.message)
  process.exit(1)
})
