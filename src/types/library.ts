// === Camera Angle ===

export interface CameraAngleInfo {
  ui_label: string
  ui_description: string
  prompt_text: string
}

export type CameraAngleLibrary = Record<string, CameraAngleInfo>

// === Shot Scale ===

export interface ShotScaleInfo {
  ui_label: string
  ui_description: string
  prompt_text: string
}

export type ShotScaleLibrary = Record<string, ShotScaleInfo>

// === Lens ===

export interface LensInfo {
  ui_label: string
  ui_description: string
  prompt_text: string
}

export type LensLibrary = Record<string, LensInfo>

// === Aspect Ratio ===

export interface AspectRatioInfo {
  ui_label: string
  ui_description: string
}

export type AspectRatioLibrary = Record<string, AspectRatioInfo>

// === Metadata ===

export interface LibraryMetadata {
  tool: string
  version: string
  description: string
}

// === Full Library ===

export interface Library {
  metadata: LibraryMetadata
  camera_angles: CameraAngleLibrary
  shot_scales: ShotScaleLibrary
  lenses: LensLibrary
  aspect_ratios: AspectRatioLibrary
}
