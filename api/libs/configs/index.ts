import dotenv, { DotenvParseOutput } from "dotenv";

export const ErrorCode = {
  GeneralError: "GENERAL_ERROR",
  InvalidId: "INVALID_ID",
  InvalidName: "INVALID_NAME",
  MissingEnv: "MISSING_ENV",
  MissingId: "MISSING_ID",
  MissingPermission: "MISSING_PERMISSION"
} as const;

export const HttpStatusCode = {
  BadRequest: 400,
  ConfigurationError: 500.19,
  Forbidden: 403,
  InternalServerError: 500,
  NotFound: 404,
  Ok: 200
} as const;

export const DATABASE_TABLE_NAME = "cassava-payment-table";

export const KMS_KEY_ID = "";

export const FREE_API_USAGE_PLAN_ID = "";

export const NEW_BLOCK_SNS_TOPIC_ARN = "";

export const REEF_RPC_ENDPOINT = "wss://rpc-testnet.reefscan.com/ws";

export default async (): Promise<DotenvParseOutput & NodeJS.ProcessEnv> => {
  const envVars = dotenv.config({ path: ".env.local" }).parsed;

  return Object.assign({}, envVars, process.env);
};
