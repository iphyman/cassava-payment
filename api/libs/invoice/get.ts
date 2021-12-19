import { Invoice, InvoiceModel } from "models/invoice";

export class GetInvoice {
  public getInvoice = async (invoiceId: string): Promise<Invoice | null> => {
    let responds: Invoice | null = null;

    const invoiceModel = await InvoiceModel();
    responds = await invoiceModel.findById(invoiceId).lean();

    return responds;
  };

  public getInvoices = async (
    merchant_id: string,
    status?: string
    // start_date?: string,
    // end_date?: string
  ): Promise<Invoice[] | null> => {
    let responds: Invoice[] | null = null;

    const invoiceModel = await InvoiceModel();
    responds = await invoiceModel.find({ merchant_id, status }).lean();

    return responds;
  };
}
