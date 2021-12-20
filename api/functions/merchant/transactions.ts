import { Response } from "libs/response";
import { MerchantModel } from "models/merchant";
import { WalletModel } from "models/wallet";
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
  // Using only one account for demo
  const account = await merchantModel.findOne({ user_id: userId }).lean();

  if (!account) return Response.notFound(404, "No transactions yet!");

  const walletModel = await WalletModel();
  const transactions = await walletModel
    .find({
      merchant_id: account.merchant_id
    })
    .select("transactions")
    .lean()
    .exec();

  return Response.ok(transactions);
};
