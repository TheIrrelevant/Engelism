# Engelism — Gemini Instructions

## Project
- **Path:** `/Users/yamacozkan/Desktop/Kraftreich/Tools/Engelism/`
- **Stack:** React 19 + TypeScript + Vite 7 + Tailwind CSS v4
- **Port:** 3001

## Magic Commands
- `Engelism!` → `npm run start-engine` (port 3001)
- `Engelismout!` → `npm run stop-engine`
- `Fabrication!` → `npm run fabrication` (cross-product batch: Angles × Scales)
- `StopFabrication!` → `npm run stop-fabrication`

## Architecture
3-step wizard: Reference → Override → Output
Engine: src/engine/ (adapter pattern — Gemini / OpenAI / Anthropic)
Types: src/types/ (wizard.ts, library.ts, batch-config.ts)
Data: src/data/library.json
Scripts: scripts/fabricate.ts (batch cross-product)

## Rules
- No enums (use `as const` objects) — Vite `erasableSyntaxOnly`
- Use `import type` for type-only imports — `verbatimModuleSyntax`
- Only 3 brand colors: #222121, #F9FEFF, #E2E7E9
