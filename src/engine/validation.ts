import type { WizardState } from '../types/wizard'
import { WizardStep } from '../types/wizard'

/**
 * Check if a given step is complete and the user can proceed to the next.
 */
export function isStepComplete(state: WizardState, step: WizardStep): boolean {
  switch (step) {
    case WizardStep.Reference:
      return state.referenceImage !== null

    case WizardStep.Override:
      return (
        state.cameraAngle !== null &&
        state.shotScale !== null &&
        state.lens !== null &&
        state.aspectRatio !== null
      )

    case WizardStep.Output:
      return state.generatedProtocol !== null

    default:
      return false
  }
}

/**
 * Check if the user can navigate to a specific step.
 * All previous steps must be complete.
 */
export function canNavigateToStep(state: WizardState, targetStep: WizardStep): boolean {
  for (let i = 0; i < targetStep; i++) {
    if (!isStepComplete(state, i as WizardStep)) return false
  }
  return true
}
