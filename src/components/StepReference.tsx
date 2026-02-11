import type { WizardState, WizardAction } from '../types/wizard'
import { ImageUpload } from './ui/ImageUpload'

interface StepReferenceProps {
  state: WizardState
  dispatch: React.Dispatch<WizardAction>
}

export function StepReference({ state, dispatch }: StepReferenceProps) {
  const handleUpload = (file: File) => {
    const preview = URL.createObjectURL(file)
    dispatch({ type: "SET_REFERENCE", file, preview })
  }

  const handleClear = () => {
    dispatch({ type: "CLEAR_REFERENCE" })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 shrink-0">
        <h2 className="font-warbler text-3xl text-bone mb-2">Reference</h2>
        <p className="text-ash/60 text-sm">
          Upload the architectural image you want to re-angle. This will be analyzed
          for building identity, materials, and 3D form.
        </p>
      </div>

      {/* Upload area */}
      <div className="flex-1 min-h-0 max-w-2xl">
        <ImageUpload
          onUpload={handleUpload}
          preview={state.referencePreview}
          onClear={handleClear}
        />
      </div>

      {/* Tip */}
      <div className="mt-4 shrink-0">
        <p className="text-ash/30 text-xs">
          For best results, upload a clear, well-lit architectural photograph.
          The reference determines the building identity and structural features
          that will be preserved in the override protocol.
        </p>
      </div>
    </div>
  )
}
