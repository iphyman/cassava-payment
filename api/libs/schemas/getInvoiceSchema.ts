import { FromSchema } from "json-schema-to-ts";

export const getInvoiceSchema = {
  type: "object",
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        merchant_id: { type: "string" },
        status: { type: "string" },
        start_date: { type: "string" },
        end_date: { type: "string" }
      }
    }
  },
  required: ["queryStringParameters", "merchant_id"]
} as const;

export type GetInvoicePayload = FromSchema<typeof getInvoiceSchema>;
