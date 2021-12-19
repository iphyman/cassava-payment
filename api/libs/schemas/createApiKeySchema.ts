import { FromSchema } from "json-schema-to-ts";

export const createApiKeySchema = {
  type: "object",
  properties: {
    user_id: { type: "string" },
    label: { type: "string" },
    description: { type: "string" },
    cold_wallet_address: { type: "string" }
  },
  required: ["label", "cold_wallet_address"]
} as const;

export type CreateApiKeyPayload = FromSchema<typeof createApiKeySchema>;
