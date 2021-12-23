import { Response } from "libs/response";
import { GetInvoice } from "libs/invoice/get";
import { ApiHandler } from "typings";

export const handler: ApiHandler = async event => {
  const merchant_id = event.queryStringParameters?.merchant_id;
  const status = event.queryStringParameters?.status;
  // const start_date = event.queryStringParameters.start_date;
  // const end_date = event.queryStringParameters.end_date;
  const controller = new GetInvoice();

  if (!merchant_id) {
    return Response.error(422, "Provide the required merchant id");
  }

  const invoice = controller.getInvoices(merchant_id, status);
  return Response.ok(invoice);
};
