import type { WizardState, WizardAction } from '../types/wizard'
import type { Library } from '../types/library'
import { SelectCard } from './ui/SelectCard'
import { InfoBox } from './ui/InfoBox'

interface StepOverrideProps {
  state: WizardState
  dispatch: React.Dispatch<WizardAction>
  lib: Library
}

export function StepOverride({ state, dispatch, lib }: StepOverrideProps) {
  const angles = Object.keys(lib.camera_angles)
  const scales = Object.keys(lib.shot_scales)
  const lenses = Object.keys(lib.lenses)
  const ratios = Object.keys(lib.aspect_ratios)

  const selectedAngleInfo = state.cameraAngle
    ? lib.camera_angles[state.cameraAngle]
    : null
  const selectedScaleInfo = state.shotScale
    ? lib.shot_scales[state.shotScale]
    : null
  const selectedLensInfo = state.lens
    ? lib.lenses[state.lens]
    : null

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4 shrink-0">
        <h2 className="font-warbler text-3xl text-bone mb-2">Override</h2>
        <p className="text-ash/60 text-sm">
          Define the new camera position. Select angle, framing scale, lens character,
          and output aspect ratio.
        </p>
      </div>

      {/* 4-column parameter grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Column 1: Camera Angle (12 options) */}
        <div className="flex flex-col min-h-0">
          <h3 className="text-ash/60 text-xs font-medium uppercase tracking-wider mb-3 pb-1 border-b border-ash/10 shrink-0">
            Camera Angle
          </h3>
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 flex flex-col gap-1.5">
            {angles.map((key) => (
              <SelectCard
                key={key}
                label={lib.camera_angles[key].ui_label}
                description={lib.camera_angles[key].ui_description}
                isSelected={state.cameraAngle === key}
                onClick={() => dispatch({ type: "SET_CAMERA_ANGLE", angle: key })}
              />
            ))}
          </div>
          {selectedAngleInfo && (
            <div className="shrink-0 mt-2">
              <InfoBox>
                <strong>{selectedAngleInfo.ui_label}</strong> — {selectedAngleInfo.ui_description}
              </InfoBox>
            </div>
          )}
        </div>

        {/* Column 2: Shot Scale (8 options) */}
        <div className="flex flex-col min-h-0">
          <h3 className="text-ash/60 text-xs font-medium uppercase tracking-wider mb-3 pb-1 border-b border-ash/10 shrink-0">
            Shot Scale
          </h3>
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 flex flex-col gap-1.5">
            {scales.map((key) => (
              <SelectCard
                key={key}
                label={lib.shot_scales[key].ui_label}
                description={lib.shot_scales[key].ui_description}
                isSelected={state.shotScale === key}
                onClick={() => dispatch({ type: "SET_SHOT_SCALE", scale: key })}
              />
            ))}
          </div>
          {selectedScaleInfo && (
            <div className="shrink-0 mt-2">
              <InfoBox>
                <strong>{selectedScaleInfo.ui_label}</strong> — {selectedScaleInfo.ui_description}
              </InfoBox>
            </div>
          )}
        </div>

        {/* Column 3: Lens (8 options) */}
        <div className="flex flex-col min-h-0">
          <h3 className="text-ash/60 text-xs font-medium uppercase tracking-wider mb-3 pb-1 border-b border-ash/10 shrink-0">
            Lens
          </h3>
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 flex flex-col gap-1.5">
            {lenses.map((key) => (
              <SelectCard
                key={key}
                label={lib.lenses[key].ui_label}
                description={lib.lenses[key].ui_description}
                isSelected={state.lens === key}
                onClick={() => dispatch({ type: "SET_LENS", lens: key })}
              />
            ))}
          </div>
          {selectedLensInfo && (
            <div className="shrink-0 mt-2">
              <InfoBox>
                <strong>{selectedLensInfo.ui_label}</strong> — {selectedLensInfo.ui_description}
              </InfoBox>
            </div>
          )}
        </div>

        {/* Column 4: Aspect Ratio (8 options) */}
        <div className="flex flex-col">
          <h3 className="text-ash/60 text-xs font-medium uppercase tracking-wider mb-3 pb-1 border-b border-ash/10 shrink-0">
            Aspect Ratio
          </h3>
          <div className="flex flex-col gap-2">
            {ratios.map((key) => (
              <button
                key={key}
                onClick={() => dispatch({ type: "SET_ASPECT_RATIO", ratio: key })}
                className={`
                  w-full py-2.5 rounded-default text-sm font-bold
                  transition-all duration-150
                  ${state.aspectRatio === key
                    ? 'bg-ash text-obsidian'
                    : 'bg-obsidian text-ash/40 border border-ash/10 hover:border-ash/30 hover:text-ash/70'
                  }
                `}
              >
                {lib.aspect_ratios[key].ui_label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
