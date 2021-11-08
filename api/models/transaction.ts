import { Entity } from "dynamodb-toolbox";
import { DatabaseTable } from "../shared";

/**
 * Create model to store transaction generated with merchant APIKEY
 */
export const Transaction = new Entity({
  name: "Transaction",
  attributes: {
    transactionId: { type: "string", partitionKey: true, required: true },
    apiKey: { type: "string", sortKey: true, required: true },
    walletAddress: { type: "string", required: true },
    amount: { type: "number", required: true },
    amountReceived: { type: "number", default: 0.0 },
    callbackUrl: { type: "string", required: true },
    watchedAddress: { type: "boolean", default: true },
    coldWalletTransferId: { type: "string" },
    createdAt: { type: "string", default: new Date() },
    updatedAt: { type: "string", default: new Date() }
  },
  table: DatabaseTable
});
