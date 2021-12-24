import fetch from "unfetch";
import { InvoiceModel } from "models/invoice";

export const handler = async (): Promise<void> => {
  const invoiceModel = await InvoiceModel();

  const invoices = await invoiceModel
    .find({
      status: "paid",
      notification_url_call_count: { $lt: 3 },
      notification_url_response: "UNKNOWN"
    })
    .lean();

  for (let index = 0; index < invoices.length; index++) {
    const invoice = invoices[index];
    const postRequest = await fetch(invoice.notification_url, {
      method: "POST",
      body: invoice
    });

    if (postRequest.ok) {
      await invoiceModel
        .findOneAndUpdate(
          {
            wallet_address: invoice.wallet_address
          },
          {
            notification_url_call_count:
              invoice.notification_url_call_count + 1,
            notification_url_response: "OK"
          }
        )
        .exec();
    } else {
      await invoiceModel
        .findOneAndUpdate(
          {
            wallet_address: invoice.wallet_address
          },
          {
            notification_url_call_count:
              invoice.notification_url_call_count + 1,
            notification_url_response: "UNKNOWN"
          }
        )
        .exec();
    }
  }

  return;
};
