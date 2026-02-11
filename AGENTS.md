# Engelism — Multi-Agent Instructions

## Project
- **Path:** `/Users/yamacozkan/Desktop/Kraftreich/Tools/Engelism/`
- **Stack:** React 19 + TypeScript + Vite 7 + Tailwind CSS v4
- **Port:** 3001

## Magic Commands
| Command | Action |
|---------|--------|
| `Engelism!` | `npm run start-engine` — Dev server port 3001 |
| `Engelismout!` | `npm run stop-engine` — Kill port 3001 |
| `Fabrication!` | `npm run fabrication` — Cross-product batch (Angles × Scales) |
| `StopFabrication!` | `npm run stop-fabrication` — Kill batch process |

## Architecture
3-step wizard: Reference → Override → Output
Multi-AI engine: Gemini / OpenAI / Anthropic (adapter pattern, auto-detect)
Fabrication: scripts/fabricate.ts — reads auto-saved config + image, cross-multiplies all angles × scales

## Rules
- No enums (use `as const` objects) — Vite `erasableSyntaxOnly`
- Use `import type` for type-only imports — `verbatimModuleSyntax`
- Only 3 brand colors: #222121, #F9FEFF, #E2E7E9
