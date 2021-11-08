import { ApiHandler } from "../../@types";
import { ResponseBuilder } from "../../shared/response";
import { TransactionService } from "../../services/transactionService";

export class TransactionController {
  /**
   * Method to create new wallet when provided with
   * amount, webhookurl and apikey payload
   * the apikey is used for logging, will remove from required params
   * when I find a way to extract from request header
   * @param event
   * @param _context
   * @param callback
   */
  public createTransaction: ApiHandler = async (event, _context, callback) => {
    let payload: { amount: string; webhook: string; apiKey: string } | null =
      null;
    let response: any;

    if (event.body) {
      payload = JSON.parse(event.body);
    }

    if (payload?.amount && payload.webhook && payload.apiKey) {
      //  Call Transaction service to create transaction
      const { amount, webhook, apiKey } = payload;
      const transactionService = new TransactionService();
      response = await transactionService.createWallet(amount, webhook, apiKey);
    }

    if (response && response.address) {
      ResponseBuilder.ok(response, callback);
    }

    ResponseBuilder.badRequest(
      "422",
      "You have not provided the required parameters!",
      callback
    );
  };
}
