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

export const DEFAULT_BLOCK_PARAMS = {
  id: "LAST_PROCESSED_BLOCK",
  height: 1418184,
  hash: "0x291e136c8a474ceac2f0826c2a1c1adc04ccccd3be39ea7a77a1e51e5fd64434"
};
