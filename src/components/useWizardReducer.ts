import { useReducer } from 'react'
import type { WizardState, WizardAction } from '../types/wizard'
import { WizardStep, INITIAL_WIZARD_STATE } from '../types/wizard'

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.step }

    case "NEXT_STEP":
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, WizardStep.Output) as WizardStep,
      }

    case "PREV_STEP":
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, WizardStep.Reference) as WizardStep,
      }

    // Step 1: Reference
    case "SET_REFERENCE":
      return { ...state, referenceImage: action.file, referencePreview: action.preview }

    case "CLEAR_REFERENCE":
      if (state.referencePreview) URL.revokeObjectURL(state.referencePreview)
      return { ...state, referenceImage: null, referencePreview: null }

    // Step 2: Override
    case "SET_CAMERA_ANGLE":
      return { ...state, cameraAngle: action.angle }

    case "SET_SHOT_SCALE":
      return { ...state, shotScale: action.scale }

    case "SET_LENS":
      return { ...state, lens: action.lens }

    case "SET_ASPECT_RATIO":
      return { ...state, aspectRatio: action.ratio }

    // Step 3: Output
    case "SET_GENERATED_PROTOCOL":
      return { ...state, generatedProtocol: action.protocol }

    case "RESET":
      if (state.referencePreview) URL.revokeObjectURL(state.referencePreview)
      return { ...INITIAL_WIZARD_STATE }

    default:
      return state
  }
}

export function useWizardReducer() {
  return useReducer(wizardReducer, INITIAL_WIZARD_STATE)
}
