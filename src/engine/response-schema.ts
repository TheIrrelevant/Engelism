export interface EngelResponseSchema {
  type: string
  properties?: Record<string, EngelResponseSchema>
  items?: EngelResponseSchema
  required?: string[]
  enum?: string[]
  additionalProperties?: boolean
}

export const ENGEL_PROTOCOL_SCHEMA: EngelResponseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    camera_override_protocol: { type: "string" },
    volumetric_reconstruction: { type: "string" },
    consistency_anchors: { type: "string" },
    framing_boundaries: { type: "string" },
    optical_physics: { type: "string" },
    final_technical_prompt: { type: "string" },
  },
  required: [
    "camera_override_protocol",
    "volumetric_reconstruction",
    "consistency_anchors",
    "framing_boundaries",
    "optical_physics",
    "final_technical_prompt",
  ],
}
