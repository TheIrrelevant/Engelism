# Engelism — Devlog

## v2.0 — React Migration (2026-02-11)
- Migrated from Streamlit (Engel) to React 19 + TypeScript + Vite 7 + Tailwind v4
- Renamed from "Engel" to "Engelism"
- **GitHub:** https://github.com/TheIrrelevant/Engelism
- 3-step wizard: Reference → Override → Output
- Multi-AI engine: Gemini / OpenAI / Anthropic (adapter pattern from Cinelab)
- Auto-detect provider from `.env` API keys
- Default model: `gemini-3-flash-preview`
- 4-column Override step: Camera Angle (12) | Shot Scale (8) | Lens (8) | Aspect Ratio (8)
- Same brand palette as Cinelab (Obsidian + Bone + Ash)
- Port 3001 (Cinelab = 3000)
- ErrorBoundary (class component) + Loading timer + CORS proxy
- Drag & drop image upload (JPG/PNG/WebP)
- JSON protocol output: 6-field structured response (copy/download)
- Temperature 0.1 for deterministic architectural output
- Build: 229KB JS + 16KB CSS (75KB gzip)
- Agent instruction files: CLAUDE.md, AGENTS.md, GEMINI.md, .cursorrules
- 8 step build completed in single session
