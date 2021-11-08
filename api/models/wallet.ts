import { Entity } from "dynamodb-toolbox";
import { DatabaseTable } from "../shared";

/**
 * Create model to store new created wallet address with encrypted privateKey
 */
export const Wallet = new Entity({
  name: "Wallet",
  attributes: {
    walletId: { type: "string", partitionKey: true, required: true },
    transactionId: { type: "string", sortKey: true, required: true },
    address: { type: "string", required: true },
    privateKey: { type: "binary", required: true },
    createdAt: { type: "string", default: new Date() }
  },
  table: DatabaseTable
});
