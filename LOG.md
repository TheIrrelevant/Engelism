# Engelism — Devlog

## v2.0.1 — Code Review Fixes (2026-02-12)
Full code review applied from Produkt/Cinelab learnings. All critical + medium + low issues fixed.

**Build & Lint:**
- ✅ Fixed TS6133: removed unused `BatchConfig` import from StepOutput
- ✅ Fixed lint errors: proper `ViteDevServer` type in vite plugin (no more `Function`/`any`)

**Critical Fixes:**
- ✅ Provider override logic: now matches Cinelab pattern
  - Previous: silent fallback when explicit provider had no key
  - Now: explicit error if `VITE_PROVIDER` set but key missing/invalid
  - Validates provider name against valid values
- ✅ Anthropic crash risk: added null check for `toolBlock.input`
  - Previous: assumed tool_use block always exists
  - Now: throws clear error if response structure unexpected

**Medium Fixes:**
- ✅ Save config false success: added `res.ok` check + try/catch
  - Previous: showed "Saved!" even if API failed (4xx/5xx)
  - Now: validates response, displays error on failure

**Low Fixes:**
- ✅ Memory leak: revoke old object URL on new reference upload
  - Previous: only cleaned up URLs on CLEAR/RESET
  - Now: revokes previous URL when SET_REFERENCE dispatched

All tests passing:
- `npm run lint` — ✅ no errors
- `npm run build` — ✅ 229KB JS + 16KB CSS

6 commits pushed to GitHub: c1209dc, 6347ac9, bf534ac, 005ac22, 623c136, 573f555

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
