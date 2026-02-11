# Engelism — Devlog

## v2.0 — React Migration (2026-02-11)
- Migrated from Streamlit (Engel) to React 19 + TypeScript + Vite 7 + Tailwind v4
- Renamed from "Engel" to "Engelism"
- 3-step wizard: Reference → Override → Output
- Multi-AI engine: Gemini / OpenAI / Anthropic (adapter pattern from Cinelab)
- Auto-detect provider from `.env` API keys
- 4-column Override step: Camera Angle (12) | Shot Scale (8) | Lens (8) | Aspect Ratio (8)
- Same brand palette as Cinelab (Obsidian + Bone + Ash)
- Port 3001 (Cinelab = 3000)
