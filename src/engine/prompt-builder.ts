import type { WizardState } from '../types/wizard'
import type { Library } from '../types/library'

export function buildPrompt(state: WizardState, lib: Library): string {
  const angleDesc = state.cameraAngle
    ? lib.camera_angles[state.cameraAngle].prompt_text
    : ''
  const scaleDesc = state.shotScale
    ? lib.shot_scales[state.shotScale].prompt_text
    : ''
  const lensDesc = state.lens
    ? lib.lenses[state.lens].prompt_text
    : ''
  const ratio = state.aspectRatio ?? 'original'

  return [
    'REFERENCE IMAGE ANALYSIS TASK:',
    'You are viewing an architectural photograph. Your task is to generate a camera override protocol',
    'that will recreate this EXACT structure from a different viewpoint.',
    '',
    'NEW CAMERA SPECIFICATIONS:',
    '',
    '1. CAMERA ANGLE OVERRIDE:',
    angleDesc,
    '',
    '2. SHOT SCALE/FRAMING:',
    scaleDesc,
    '',
    '3. LENS OPTICAL CHARACTER:',
    lensDesc,
    '',
    `4. ASPECT RATIO: ${ratio}`,
    '',
    'REQUIRED OUTPUT STRUCTURE (JSON):',
    '{',
    '  "camera_override_protocol": "Explicit command describing how the camera position changes from the reference to achieve the new angle.",',
    '  "volumetric_reconstruction": "Detailed description of how the building\'s 3D form will appear from the new angle.",',
    '  "consistency_anchors": "List of specific architectural features that MUST remain identical.",',
    '  "framing_boundaries": "Precise description of what should be included in the frame based on the shot scale.",',
    '  "optical_physics": "Explanation of how the specified lens will render the scene.",',
    '  "final_technical_prompt": "A complete, production-ready technical prompt that synthesizes all above elements."',
    '}',
    '',
    'CONSISTENCY REMINDER: The building\'s architectural identity must be preserved with 90-95% fidelity.',
    'Only the camera position, framing, and optical rendering change - NOT the building design itself.',
  ].join('\n')
}
