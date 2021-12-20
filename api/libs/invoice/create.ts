import { InvoiceModel } from "models/invoice";
import type { CreateInvoicePayload } from "libs/schemas/createInvoiceSchema";
import type { ICreateWallet } from "typings/reef";
import { ReefWallet } from "libs/reef/wallet";
import { TRANSACTION_TIME } from "libs/constants";
import { WalletModel } from "models/wallet";

export class InvoiceCreator {
  public createInvoice = async (
    payload: CreateInvoicePayload
  ): Promise<string | null> => {
    let wallet: ICreateWallet = null;
    let response: string | null = null;

    switch (payload.blockchain) {
      case "REEF":
        {
          const reef = new ReefWallet();
          wallet = await reef.createWallet();
        }
        break;

      case "ETH":
        // {process ETH}
        break;

      case "BSC":
        // {process BSC}
        break;

      default:
        // do nothing, response will be null
        break;
    }

    if (!wallet || !wallet.wallet_address) return null;

    const expiry_time = new Date();
    expiry_time.setMinutes(expiry_time.getMinutes() + TRANSACTION_TIME);

    const {
      order_id,
      item_description,
      merchant_id,
      buyer,
      currency,
      price,
      notification_url,
      redirect_url,
      close_url
    } = payload;

    const invoiceModel = await InvoiceModel();
    const session = await invoiceModel.startSession();
    session.startTransaction();

    try {
      const invoice = await new invoiceModel({
        order_id,
        item_description,
        merchant_id,
        wallet_address: wallet.wallet_address,
        buyer,
        currency,
        price,
        notification_url,
        redirect_url,
        close_url,
        expiry_time,
        status: "new",
        watched_address: true
      }).save({ session });

      const walletModel = await WalletModel();
      await new walletModel({
        invoice_id: invoice._id,
        merchant_id,
        wallet_address: wallet.wallet_address,
        private_key: wallet.private_key
      }).save({ session });

      await session.commitTransaction();
      await session.endSession();
      response = invoice._id;

      return response;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      return response;
    }
  };
}
