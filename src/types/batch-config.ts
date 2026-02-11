/**
 * Serializable config exported from the UI for batch fabrication.
 * Lens + Aspect Ratio are fixed; Camera Angle × Shot Scale are cross-multiplied by the script.
 */
export interface BatchConfig {
  lens: string
  aspectRatio: string
  referenceImage: string  // filename saved by Vite middleware
}
