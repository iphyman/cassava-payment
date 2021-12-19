import { FromSchema } from "json-schema-to-ts";

const buyerSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" },
    address1: { type: "string" },
    address2: { type: "string" },
    city: { type: "string" },
    region: { type: "string" },
    postal_code: { type: "string" },
    country: { type: "string" },
    notify: { type: "boolean" }
  }
} as const;

export const createInvoiceSchema = {
  type: "object",
  properties: {
    order_id: { type: "string" },
    item_description: { type: "string", minLength: 15 },
    merchant_id: { type: "string", minLength: 20 },
    buyer: buyerSchema,
    currency: { type: "string", minLength: 3, maxLength: 4 },
    blockchain: { type: "string", minLength: 3, maxLength: 4 },
    price: { type: "number" },
    notification_url: { type: "string" },
    redirect_url: { type: "string" },
    close_url: { type: "number" }
  },
  required: ["merchant_id", "price", "redirect_url"]
} as const;

export type CreateInvoicePayload = FromSchema<typeof createInvoiceSchema>;
