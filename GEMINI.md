# Engelism — Gemini Instructions

## Project
- **Path:** `/Users/yamacozkan/Desktop/Kraftreich/Tools/Engelism/`
- **Stack:** React 19 + TypeScript + Vite 7 + Tailwind CSS v4
- **Port:** 3001

## Magic Commands
- `StartEngine!` → `npm run dev` (port 3001)
- `StopEngine!` → kill port 3001

## Architecture
3-step wizard: Reference → Override → Output
Engine: src/engine/ (adapter pattern)
Types: src/types/ (wizard.ts, library.ts)
Data: src/data/library.json
