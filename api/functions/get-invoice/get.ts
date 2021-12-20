import { Response } from "libs/response";
import { GetInvoice } from "libs/invoice/get";
import { ApiHandler } from "typings";

export const handler: ApiHandler = async event => {
  const invoiceId = event.pathParameters?.invoiceId;
  const controller = new GetInvoice();
  if (!invoiceId) {
    return Response.notFound(422, "Provide the required invoice id");
  }

  const invoice = await controller.getInvoice(invoiceId);

  if (!invoice) return Response.notFound(404, "No record found!");

  return Response.ok(invoice);
};
