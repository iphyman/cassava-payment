import { Model, Schema } from "mongoose";
import { getConnection } from "libs/mongodb";

/**
 * Create schema to store transaction generated with merchant APIKEY
 */

interface IBuyer {
  name?: string;
  email?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country?: string;
  notify?: boolean;
}

export interface Invoice {
  order_id?: string;
  item_description?: string;
  merchant_id: string;
  wallet_address: string;
  buyer?: IBuyer;
  currency?: string;
  price: string;
  amount_paid?: string;
  notification_url?: string;
  redirect_url: string;
  close_url?: string;
  expiry_time: Date;
  watched_address: boolean;
  status: string;
}

const BuyerSchema: Schema = new Schema<IBuyer>({
  name: { type: String, required: false },
  email: { type: String, required: false },
  phone: { type: String, required: false },
  address1: { type: String, required: false },
  address2: { type: String, required: false },
  city: { type: String, required: false },
  region: { type: String, required: false },
  postal_code: { type: String, required: false },
  country: { type: String, required: false },
  notify: { type: Boolean, required: false }
});

const schema = new Schema<Invoice>(
  {
    order_id: { type: String, required: false },
    item_description: { type: String, required: false },
    merchant_id: { type: String, required: true },
    wallet_address: { type: String, unique: true, required: true },
    buyer: { type: BuyerSchema, required: false },
    currency: { type: String, default: "REEF" },
    price: { type: String, required: true },
    amount_paid: { type: String, default: "0.0" },
    notification_url: { type: String, required: false },
    redirect_url: { type: String, required: true },
    close_url: { type: String, required: false },
    expiry_time: { type: Date, required: false, default: new Date() },
    watched_address: { type: Boolean, required: true },
    status: { type: String, required: true }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

export const InvoiceModel = async (): Promise<Model<Invoice>> => {
  const connection = await getConnection();

  return connection.model<Invoice>("InvoiceModel", schema);
};
