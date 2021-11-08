import { Entity } from "dynamodb-toolbox";
import { DatabaseTable } from "../shared";

/**
 * Create model to store last synced block height
 */
export const Block = new Entity({
  name: "Block",
  attributes: {
    id: {
      type: "string",
      partitionKey: true,
      required: true,
      default: "LAST_PROCESSED_BLOCK"
    },
    blockchain: { type: "string", sortKey: true, default: "REEF_BLOCKCHAIN" },
    hash: { type: "number", required: true },
    height: { type: "number", required: true },
    createdAt: { type: "string", default: new Date() },
    updatedAt: { type: "string", default: new Date() }
  },
  table: DatabaseTable
});
