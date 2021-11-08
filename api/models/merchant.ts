import { Entity } from "dynamodb-toolbox";
import { DatabaseTable } from "../shared";

/**
 * Create model to store merchant accounts
 * User can have multiple merchant accounts
 */
export const Merchant = new Entity({
  name: "Merchant",
  attributes: {
    merchantId: { type: "string", partitionKey: true, required: true },
    userId: { type: "string", sortKey: true },
    apiKey: { type: "string", required: true },
    label: { type: "string" },
    enabled: { type: "boolean", default: true },
    coldWalletAddress: { type: "string", required: true },
    createdAt: { type: "string", default: new Date() },
    updatedAt: { type: "string", default: new Date() }
  },
  table: DatabaseTable
});
