import { useState, useRef, useEffect } from 'react'
import type { WizardState, WizardAction } from '../types/wizard'
import type { Library } from '../types/library'
import type { BatchConfig } from '../types/batch-config'
import { buildPrompt } from '../engine/prompt-builder'
import { runEngelEngine } from '../engine/run'
import { fileToBase64 } from '../engine/utils'

interface StepOutputProps {
  state: WizardState
  dispatch: React.Dispatch<WizardAction>
  lib: Library
}

export function StepOutput({ state, dispatch, lib }: StepOutputProps) {
  const [loading, setLoading] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval>>(null)

  const hasProtocol = !!state.generatedProtocol

  // Loading timer
  useEffect(() => {
    if (loading) {
      setElapsed(0)
      timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [loading])

  const handleGenerate = async () => {
    if (!state.referenceImage) return
    setLoading(true)
    setError(null)

    try {
      const prompt = buildPrompt(state, lib)
      const result = await runEngelEngine(prompt, state.referenceImage)
      dispatch({ type: "SET_GENERATED_PROTOCOL", protocol: result })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyOrGenerate = async () => {
    if (hasProtocol) {
      await navigator.clipboard.writeText(state.generatedProtocol!)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else {
      handleGenerate()
    }
  }

  const handleDownload = () => {
    if (!state.generatedProtocol) return
    const blob = new Blob([state.generatedProtocol], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `engelism-protocol-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const [configSaved, setConfigSaved] = useState(false)

  const handleSaveConfig = async () => {
    if (!state.referenceImage) return
    const imageBase64 = await fileToBase64(state.referenceImage)
    const config = {
      lens: state.lens ?? '',
      aspectRatio: state.aspectRatio ?? '',
      referenceImage: '',  // filled by server
    }
    await fetch('/api/save-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config, imageBase64, imageMimeType: state.referenceImage.type }),
    })
    setConfigSaved(true)
    setTimeout(() => setConfigSaved(false), 2000)
  }

  const handleReset = () => {
    dispatch({ type: "RESET" })
  }

  // Primary button label
  const primaryLabel = loading
    ? `Analyzing Architecture... ${elapsed}s`
    : hasProtocol
      ? (copied ? 'Copied!' : 'Copy')
      : 'Start Protocol'

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 shrink-0">
        <h2 className="font-warbler text-3xl text-bone mb-2">Output</h2>
        <p className="text-ash/60 text-sm">
          Review your camera override parameters and generate the protocol.
        </p>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 shrink-0">
        <SummaryCard label="Camera Angle" value={
          state.cameraAngle ? lib.camera_angles[state.cameraAngle].ui_label : null
        } />
        <SummaryCard label="Shot Scale" value={
          state.shotScale ? lib.shot_scales[state.shotScale].ui_label : null
        } />
        <SummaryCard label="Lens" value={
          state.lens ? lib.lenses[state.lens].ui_label : null
        } />
        <SummaryCard label="Aspect Ratio" value={
          state.aspectRatio ? lib.aspect_ratios[state.aspectRatio].ui_label : null
        } />
      </div>

      {/* Reference preview (small) */}
      {state.referencePreview && (
        <div className="mb-6 shrink-0">
          <h3 className="text-ash/60 text-xs font-medium uppercase tracking-wider mb-3 pb-1 border-b border-ash/10">
            Reference
          </h3>
          <img
            src={state.referencePreview}
            alt="Reference"
            className="h-24 object-contain rounded-default"
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="border border-ash/20 rounded-default p-3 mb-4 text-xs text-ash/60 shrink-0">
          {error}
        </div>
      )}

      {/* Loading bar */}
      {loading && (
        <div className="mb-4 h-1 bg-ash/10 rounded-full overflow-hidden shrink-0">
          <div className="h-full bg-ash/40 loading-pulse rounded-full w-full" />
        </div>
      )}

      {/* Action buttons — always visible */}
      <div className="flex gap-3 shrink-0">
        {/* Start Protocol / Copy */}
        <button
          onClick={handleCopyOrGenerate}
          disabled={loading}
          className={`
            flex-1 py-3 rounded-default text-sm font-bold uppercase tracking-wider
            transition-all duration-150
            ${loading
              ? 'bg-ash/10 text-ash/30 cursor-wait'
              : copied
                ? 'bg-bone text-obsidian'
                : 'bg-ash text-obsidian hover:opacity-90'
            }
          `}
        >
          {primaryLabel}
        </button>

        {/* Download */}
        <button
          onClick={handleDownload}
          disabled={!hasProtocol}
          className={`
            flex-1 py-3 rounded-default text-sm font-bold uppercase tracking-wider
            transition-all duration-150
            ${hasProtocol
              ? 'bg-ash text-obsidian hover:opacity-90'
              : 'bg-ash/10 text-ash/20 cursor-not-allowed'
            }
          `}
        >
          Download
        </button>

        {/* Regenerate */}
        <button
          onClick={handleGenerate}
          disabled={!hasProtocol || loading}
          className={`
            px-6 py-3 rounded-default text-sm font-medium uppercase tracking-wider
            transition-all duration-150
            ${hasProtocol && !loading
              ? 'border border-ash/20 text-ash/60 hover:text-bone hover:border-ash/40'
              : 'border border-ash/10 text-ash/15 cursor-not-allowed'
            }
          `}
        >
          Regenerate
        </button>

        {/* Save Config */}
        <button
          onClick={handleSaveConfig}
          className={`
            px-6 py-3 rounded-default text-sm font-medium uppercase tracking-wider
            transition-all duration-150
            ${configSaved
              ? 'bg-bone text-obsidian'
              : 'border border-ash/20 text-ash/60 hover:text-bone hover:border-ash/40'
            }
          `}
        >
          {configSaved ? 'Saved!' : 'Save Config'}
        </button>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="
            px-6 py-3 rounded-default text-sm font-medium uppercase tracking-wider
            border border-ash/20 text-ash/60 hover:text-bone hover:border-ash/40
            transition-all duration-150
          "
        >
          Reset
        </button>
      </div>
    </div>
  )
}

// === Summary card helper ===

function SummaryCard({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="border border-ash/10 rounded-default px-3 py-2">
      <p className="text-ash/40 text-[10px] uppercase tracking-wider">{label}</p>
      <p className="text-bone text-sm font-medium truncate">{value ?? "—"}</p>
    </div>
  )
}
