import { InvoiceCreator } from "libs/invoice/create";
import { Response } from "libs/response";
import type { CreateInvoicePayload } from "libs/schemas/createInvoiceSchema";
import { ApiHandler } from "typings";

export const handler: ApiHandler = async event => {
  const controller = new InvoiceCreator();
  const body: CreateInvoicePayload = JSON.parse(event.body as string);
  body.blockchain = "REEF"; // Only supporting REEF blockchain at th moment
  const invoice = await controller.createInvoice(body);

  // TODO: better error code and description when no response
  if (!invoice) {
    return Response.badRequest(
      422,
      "We could not process your request this moment, try again later"
    );
  }

  return Response.ok({
    url: "https://cassavapay.netlify.app/checkout/" + invoice,
    invoice_id: invoice
  });
};
