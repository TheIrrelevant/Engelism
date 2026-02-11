---
name: engelism
description: >
  AI-powered camera override protocol generator for architectural photography.
  Analyzes a reference building image and produces structured JSON protocols describing
  how to recreate the same structure from any camera angle and framing. Supports Gemini,
  OpenAI, and Anthropic as interchangeable providers. Includes CLI batch mode for generating
  all angle/scale combinations in parallel.
license: Apache-2.0
metadata:
  author: Kraftreich
  version: "2.0"
  stack: React 19, TypeScript, Vite 7, Tailwind CSS v4
  status: stable
compatibility: Requires Node.js 20+. At least one AI provider API key (Google Gemini, OpenAI, or Anthropic).
---

# Engelism

**AI-powered camera override protocol engine by Kraftreich.**

Engelism takes an architectural photograph and a set of camera parameters — angle, shot scale, lens, aspect ratio — and generates a structured JSON protocol that describes how to recreate the exact same building from a completely different viewpoint.

## How It Works

```
Reference Image + Camera Parameters ──► Prompt Builder ──► AI Provider ──► JSON Protocol
```

The wizard walks through three steps:

| Step | Name | What It Does |
|------|------|-------------|
| 1 | **Reference** | Upload an architectural photograph (drag & drop) |
| 2 | **Override** | Choose camera angle, shot scale, lens, aspect ratio |
| 3 | **Output** | Generate the camera override protocol as structured JSON |

The output is a 6-field JSON protocol:

- **camera_override_protocol** — Explicit command describing the camera position change
- **volumetric_reconstruction** — How the building's 3D form appears from the new angle
- **consistency_anchors** — Architectural features that must remain identical
- **framing_boundaries** — What should be included in the frame
- **optical_physics** — How the specified lens renders the scene
- **final_technical_prompt** — Complete, production-ready technical prompt

### Using the Output

> **The generated protocol is NOT a standalone prompt.**
> You must submit `final_technical_prompt` **together with the original reference image** to your AI image generator. The reference image is the identity anchor — without it, the AI has no building to preserve and will generate a completely different structure.

```
Reference Image + final_technical_prompt ──► AI Image Generator ──► Overridden Result
```

If you paste the prompt alone without the reference image, the AI will hallucinate an entirely new building. The whole point of the protocol is **camera override, not building generation** — the building already exists in your reference.

## Quick Start

```bash
# 1. Clone and install
cd Engelism
npm install

# 2. Configure your AI provider
cp .env.example .env
# Add at least one API key:
#   VITE_GOOGLE_API_KEY=...    (Gemini — default)
#   VITE_OPENAI_API_KEY=...    (OpenAI)
#   VITE_ANTHROPIC_API_KEY=... (Anthropic)

# 3. Start the wizard
npm run dev
```

Open `http://localhost:3001` and walk through the three steps.

## Provider Auto-Detection

Engelism detects which AI provider to use based on available API keys. No manual `VITE_PROVIDER` needed.

**Priority order:** Gemini → OpenAI → Anthropic (first available key wins).

| Provider | Default Model | Env Variable |
|----------|--------------|-------------|
| Gemini | `gemini-3-flash-preview` | `VITE_GOOGLE_API_KEY` |
| OpenAI | `gpt-4o` | `VITE_OPENAI_API_KEY` |
| Anthropic | `claude-sonnet-4-5-20250929` | `VITE_ANTHROPIC_API_KEY` |

Override the model with `VITE_MODEL=your-model-id` if needed.

## Batch Mode (Fabrication)

Generate protocols for every Camera Angle × Shot Scale combination from a single reference image.

```bash
# 1. Complete the wizard in the UI and click "Save Config"
#    → auto-saves engelism-config.json + reference image to project root

# 2. Run batch fabrication
npm run fabrication

# Options
npm run fabrication -- --concurrency 5
```

- Reads `engelism-config.json` for fixed parameters (lens, aspect ratio)
- Cross-multiplies **12 camera angles × 8 shot scales = 96 combinations**
- Outputs `Protocols/{Angle}-{Scale}-{Lens}.json` for each combination
- Parallel execution with `--concurrency` (1–10, default: 3)
- Logs progress: `[12/96] ✓ Eye Level-Full Shot-50mm Natural`

## Override Library

The built-in `library.json` contains:

| Category | Count | Examples |
|----------|-------|---------|
| Camera Angles | 12 | Eye Level, Bird's Eye, Aerial Drone, Dutch Angle, Worm's Eye |
| Shot Scales | 8 | Extreme Close-Up, Medium Shot, Full Shot, Extreme Long Shot |
| Lenses | 8 | 8mm Fisheye, 35mm Classic, 50mm Natural, 200mm Telephoto, Anamorphic |
| Aspect Ratios | 8 | 1:1 Square, 16:9 Widescreen, 21:9 Ultrawide, 9:16 Stories |

## Architecture

```
src/
├── engine/                     # AI-agnostic core — no UI dependency
│   ├── run.ts                  # Single entry point: runEngelEngine()
│   ├── prompt-builder.ts       # Builds the architectural analysis prompt
│   ├── response-schema.ts      # Universal JSON Schema (6-field protocol)
│   ├── provider-types.ts       # EngelProvider interface + EngelRequest
│   ├── provider-config.ts      # Auto-detect provider from env
│   ├── validation.ts           # Step validation
│   ├── utils.ts                # fileToBase64 helper
│   └── providers/
│       ├── gemini.ts           # Gemini REST adapter
│       ├── openai.ts           # OpenAI Chat adapter
│       └── anthropic.ts        # Anthropic Messages adapter
├── components/                 # React UI
│   ├── WizardShell.tsx         # Main wizard container
│   ├── StepIndicator.tsx       # 3-step progress bar
│   ├── StepReference.tsx       # Step 1: image upload
│   ├── StepOverride.tsx        # Step 2: camera angle/scale/lens/ratio
│   ├── StepOutput.tsx          # Step 3: generate + action buttons
│   ├── ErrorBoundary.tsx       # Branded error fallback
│   └── ui/                     # Shared UI primitives
│       ├── ImageUpload.tsx
│       ├── SelectCard.tsx
│       ├── InfoBox.tsx
│       └── OptionPill.tsx
├── types/
│   ├── wizard.ts               # WizardState, WizardAction, step config
│   ├── library.ts              # CameraAngle, ShotScale, Lens types
│   └── batch-config.ts         # Serializable config for CLI
├── data/
│   ├── library.json            # Camera angles, shot scales, lenses catalog
│   └── useLibrary.ts           # JSON loader hook
├── App.tsx
├── main.tsx
└── index.css                   # Tailwind + Kraftreich design tokens

scripts/
└── fabricate.ts                # CLI batch: cross-product protocol generator
```

**Design principle:** The `engine/` layer has zero React dependency. If the UI framework changes, the engine stays untouched.

## Key Design Decisions

### Adapter Pattern for AI Providers

Every provider implements the same `EngelProvider` interface:

```typescript
interface EngelProvider {
  readonly name: string
  generate(request: EngelRequest, config: ProviderConfig): Promise<string>
}
```

The universal `EngelResponseSchema` is converted to each provider's native format:
- **Gemini** → `responseSchema` with uppercase type names
- **OpenAI** → `response_format.json_schema`
- **Anthropic** → `tool_use` with `input_schema`

### Enforced JSON Schema

The 6-field response schema locks every key name and type. This eliminates the inconsistency problem where AI models generate different key names on every run. The same prompt always returns the same structure.

### Cross-Product Fabrication

Unlike single-image batch processing, Engelism's Fabrication takes **one** reference image and generates **all possible viewpoints** by crossing every camera angle with every shot scale. The lens and aspect ratio stay fixed from the saved config. This produces a complete override library for a single building.

### Consistency Anchors

The prompt engineering enforces 90–95% building fidelity. The AI must identify and preserve specific architectural features (materials, textures, colors, proportions) across every angle change. Only the camera position and framing change — never the building design itself.

## Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start Vite dev server on port 3001 |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run start-engine` | Dev server + open browser |
| `npm run stop-engine` | Kill process on port 3001 |
| `npm run fabrication` | Cross-product batch (reads auto-saved config) |
| `npm run stop-fabrication` | Kill running fabrication |

### Magic Commands (AI IDE Agents)

If you're using an AI-powered IDE (Claude Code, Cursor, Antigravity), you can use these shorthand commands instead of typing the full npm scripts:

| Command | What It Does |
|---------|-------------|
| `Engelism!` | Start the dev server and open the browser (`npm run start-engine`) |
| `Engelismout!` | Stop the dev server (`npm run stop-engine`) |
| `Fabrication!` | Run cross-product batch processing (`npm run fabrication`) |
| `StopFabrication!` | Kill the running batch process (`npm run stop-fabrication`) |

These commands are defined in `CLAUDE.md`, `GEMINI.md`, and `.cursorrules`.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GOOGLE_API_KEY` | One of three | Google Gemini API key |
| `VITE_OPENAI_API_KEY` | One of three | OpenAI API key |
| `VITE_ANTHROPIC_API_KEY` | One of three | Anthropic API key |
| `VITE_PROVIDER` | No | Force a specific provider (`gemini` / `openai` / `anthropic`) |
| `VITE_MODEL` | No | Override the default model ID |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Bundler | Vite 7 |
| Styling | Tailwind CSS v4 |
| Fonts | Warbler (headlines) + Avenir (body) |
| CLI Runtime | tsx (for batch scripts) |
| Linter | ESLint 9 |

## Roadmap

| Feature | Description | Status |
|---------|------------|--------|
| **New AI Providers** | Mistral, Grok, and local model support (Ollama) | Planned |
| **IDE Plugins** | Native extensions for VS Code, Cursor, and Antigravity — run Engelism directly from the editor sidebar | Planned |
| **3D Preview** | Visual preview of the camera position change — wireframe building model showing old vs new viewpoint | Planned |
| **Extended Library** | More camera angles (crane, steadicam, gimbal paths), specialty lenses, and architectural style presets | Planned |
| **Multi-Building** | Support for architectural complexes — maintain consistency across multiple buildings in a single scene | Planned |
| **FactoryIR Integration** | Direct pipeline to FactoryIR for rendering the generated protocols into final images | Planned |

---

## The Story Behind Engelism

Engelism wasn't born from a feature request. It was born from a frustration.

When working with AI image generation for architectural visualization, every camera angle change would produce a **different building**. The materials would shift. The proportions would warp. The identity would dissolve. There was no way to say "show me this exact building, but from above" and get a consistent result.

Engelism solves this by separating the **what** from the **where**. The reference image locks the building identity. The override protocol describes only the camera change. The AI receives both — and the architecture survives the angle shift.

**What started as a Streamlit prototype** (Engel) became a full React 19 + TypeScript application with provider-agnostic architecture, enforced JSON schemas, cross-product batch processing, and multi-IDE support — all built through prompts, not sprints.

The 6-field protocol structure wasn't designed in a meeting. It emerged from hundreds of failed generations where key information kept getting lost. Each field exists because its absence caused a specific, repeatable failure mode.

> **Engelism** is a Kraftreich tool.
> Vibe-coded from zero to production — one prompt at a time.
