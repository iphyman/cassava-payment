import { FromSchema } from "json-schema-to-ts";

export const outputSchema = {
  type: "object",
  properties: {
    headers: {
      type: "object"
    },
    body: {
      type: "object"
    },
    statusCode: {
      type: "number"
    }
  },
  required: ["body", "statusCode", "headers"]
} as const;

export type OutputSchema = FromSchema<typeof outputSchema>;
