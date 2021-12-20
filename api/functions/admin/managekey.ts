import { Response } from "libs/response";
import { MerchantApiKey } from "libs/merchant/apikey";
import { ApiHandler } from "typings";

export const handler: ApiHandler = async event => {
  const userId = event.requestContext.identity.cognitoIdentityId;

  if (!event.body) {
    return Response.badRequest(
      422,
      "You have not provided the required payload"
    );
  }

  if (userId && userId !== "us-west-2:86f5ac90-f83c-4fb0-a47d-48d474a53f2f")
    return Response.badRequest(
      401,
      "You are not authorized to access this route, only admins can"
    );

  const payload: { api_key: string } = JSON.parse(event.body);

  const controller = new MerchantApiKey();
  const response = await controller.enableDisableKey(payload.api_key);

  if (!response) return Response.notFound(422, "No record found");

  return Response.ok(response);
};
