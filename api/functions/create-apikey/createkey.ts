import { Response } from "libs/response";
import { MerchantApiKey } from "libs/merchant/apikey";
import type { CreateApiKeyPayload } from "libs/schemas/createApiKeySchema";
import { ApiHandler } from "typings";

export const handler: ApiHandler = async event => {
  const userId = event.requestContext.identity.cognitoIdentityId;

  if (!event.body) {
    return Response.badRequest(
      422,
      "You have not provided the required payload"
    );
  }

  if (!userId) {
    return Response.badRequest(
      422,
      "You are not authorized to access this route"
    );
  }

  const payload: CreateApiKeyPayload = JSON.parse(event.body);
  payload.user_id = userId;

  const controller = new MerchantApiKey();
  const response = await controller.createKey(payload);

  return Response.ok(response);
};
