import { InvoiceModel } from "models/invoice";

export const handler = async (): Promise<void> => {
  const invoiceModel = await InvoiceModel();
  const now = new Date();

  await invoiceModel
    .updateMany(
      {
        watched_address: true,
        status: "new",
        expiry_time: { $lt: now }
      },
      { $set: { status: "expired", watched_address: false } }
    )
    .exec();

  return;
};
