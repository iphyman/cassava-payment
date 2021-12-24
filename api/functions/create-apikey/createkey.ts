import log from "lambda-log";
import { Response } from "libs/response";
import { MerchantApiKey } from "libs/merchant/apikey";
import type { CreateApiKeyPayload } from "libs/schemas/createApiKeySchema";
import { ApiHandler } from "typings";

export const handler: ApiHandler = async event => {
  const userId = event.requestContext.identity.cognitoIdentityId;
  log.info("current user Id", { userId });

  if (!event.body) {
    return Response.error(422, "You have not provided the required payload");
  }

  if (!userId) {
    return Response.error(401, "You are not authorized to access this route");
  }

  const payload: CreateApiKeyPayload = JSON.parse(event.body as string);
  payload.user_id = userId;

  if (!payload.cold_wallet_address || !payload.label) {
    return Response.error(422, "You must provide a label and wallet address");
  }

  const controller = new MerchantApiKey();
  const response = await controller.createKey(payload);

  log.info("New api key issued", { response });

  return Response.ok(response);
};
