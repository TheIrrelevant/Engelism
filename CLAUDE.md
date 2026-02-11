# Engelism — Claude Code Instructions

## Magic Commands

| Command | Action |
|---------|--------|
| `Engelism!` | `cd /Users/yamacozkan/Desktop/Kraftreich/Tools/Engelism && npm run start-engine` |
| `Engelismout!` | `cd /Users/yamacozkan/Desktop/Kraftreich/Tools/Engelism && npm run stop-engine` |
| `Fabrication!` | `cd /Users/yamacozkan/Desktop/Kraftreich/Tools/Engelism && npm run fabrication` |
| `StopFabrication!` | `cd /Users/yamacozkan/Desktop/Kraftreich/Tools/Engelism && npm run stop-fabrication` |

## Project Info

- **Tool:** Engelism — Camera Override Protocol Generator
- **Path:** `/Users/yamacozkan/Desktop/Kraftreich/Tools/Engelism/`
- **Stack:** React 19 + TypeScript + Vite 7 + Tailwind v4
- **Port:** 3001
- **Engine:** Multi-AI (Gemini / OpenAI / Anthropic)
- **Brand:** Obsidian Black #222121 + Bone White #F9FEFF + Ash Silver #E2E7E9

## Architecture

- `src/components/` — Wizard steps + UI primitives
- `src/engine/` — Multi-AI adapter pattern
- `src/types/` — TypeScript type definitions
- `src/data/` — Library JSON + loader hook

## Rules

- No enums (use `as const` objects) — Vite `erasableSyntaxOnly`
- Use `import type` for type-only imports — `verbatimModuleSyntax`
- Only 3 brand colors — no extra hex values
- ErrorBoundary must be a class component
