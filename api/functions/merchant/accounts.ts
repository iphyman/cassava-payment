import log from "lambda-log";
import { Response } from "libs/response";
import { MerchantModel } from "models/merchant";
import { ApiHandler } from "typings";

export const handler: ApiHandler = async event => {
  const userId = event.requestContext.identity.cognitoIdentityId;
  log.info("current userId", { userId });

  if (!userId) {
    return Response.error(400, "You are not authorized to access this route");
  }

  const merchantModel = await MerchantModel();
  const accounts = await merchantModel.find({ user_id: userId }).lean();
  log.info("User accounts", { accounts });

  return Response.ok(accounts);
};
