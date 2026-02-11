// === Wizard Step (3 steps) ===

export const WizardStep = {
  Reference: 0,
  Override: 1,
  Output: 2,
} as const

export type WizardStep = (typeof WizardStep)[keyof typeof WizardStep]

export const WIZARD_STEP_LABELS: Record<WizardStep, string> = {
  [WizardStep.Reference]: "Reference",
  [WizardStep.Override]: "Override",
  [WizardStep.Output]: "Output",
}

// === Wizard State ===

export interface WizardState {
  currentStep: WizardStep

  // Step 1: Reference
  referenceImage: File | null
  referencePreview: string | null  // Object URL for preview

  // Step 2: Override (all 4 camera params)
  cameraAngle: string | null
  shotScale: string | null
  lens: string | null
  aspectRatio: string | null

  // Step 3: Output
  generatedProtocol: string | null
}

// === Wizard Actions ===

export type WizardAction =
  | { type: "SET_STEP"; step: WizardStep }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  // Step 1
  | { type: "SET_REFERENCE"; file: File; preview: string }
  | { type: "CLEAR_REFERENCE" }
  // Step 2
  | { type: "SET_CAMERA_ANGLE"; angle: string }
  | { type: "SET_SHOT_SCALE"; scale: string }
  | { type: "SET_LENS"; lens: string }
  | { type: "SET_ASPECT_RATIO"; ratio: string }
  // Step 3
  | { type: "SET_GENERATED_PROTOCOL"; protocol: string }
  | { type: "RESET" }

// === Initial State ===

export const INITIAL_WIZARD_STATE: WizardState = {
  currentStep: WizardStep.Reference,

  referenceImage: null,
  referencePreview: null,

  cameraAngle: null,
  shotScale: "full_shot",     // default: Full Shot
  lens: "50mm_natural",       // default: 50mm Natural
  aspectRatio: "16:9",        // default: 16:9 Widescreen

  generatedProtocol: null,
}
