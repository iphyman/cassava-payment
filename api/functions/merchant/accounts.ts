import { Response } from "libs";
import { MerchantModel } from "models/merchant";
import { ApiHandler } from "typings";

export const handler: ApiHandler = async event => {
  const userId = event.requestContext.identity.cognitoIdentityId;

  if (!userId) {
    return Response.badRequest(
      400,
      "You are not authorized to access this route"
    );
  }

  const merchantModel = await MerchantModel();
  const accounts = await merchantModel.find({ user_id: userId }).lean();

  return Response.ok(accounts);
};
