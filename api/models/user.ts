import { Entity } from "dynamodb-toolbox";
import { DatabaseTable } from "../shared";

/**
 * Create model to store newly registered user in database
 */
export const User = new Entity({
  name: "User",
  attributes: {
    email: { type: "string", partitionKey: true, required: true },
    sk: { hidden: true, sortKey: true, default: "User" },
    userId: { type: "string", required: true },
    password: { type: "string", required: true },
    name: { type: "string" },
    createdAt: { type: "string" }
  },
  table: DatabaseTable
});
