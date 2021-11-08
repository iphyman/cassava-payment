import { DynamoDB } from "aws-sdk";
import { Table } from "dynamodb-toolbox";
import { DATABASE_TABLE_NAME } from "./constants";

const DocumentClient = new DynamoDB.DocumentClient();

export const DatabaseTable = new Table({
  name: DATABASE_TABLE_NAME,
  partitionKey: "pk",
  sortKey: "sk",
  DocumentClient
});
