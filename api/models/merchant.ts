import { Model, Schema } from "mongoose";
import { getConnection } from "libs/mongodb";

/**
 * Create schema and model to store merchant accounts
 * User can have multiple merchant accounts
 */

export interface Merchant {
  merchant_id: string;
  user_id: string;
  api_key: string;
  label: string;
  description?: string;
  enabled: boolean;
  cold_wallet_address: string;
}

const schema: Schema = new Schema<Merchant>(
  {
    merchant_id: { type: String, unique: true, required: true },
    user_id: { type: String, required: true },
    api_key: { type: String, unique: true, required: true },
    label: { type: String, required: true },
    description: { type: String, required: false },
    enabled: { type: Boolean, default: true },
    cold_wallet_address: { type: String, required: true }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

export const MerchantModel = async (): Promise<Model<Merchant>> => {
  const connection = await getConnection();

  return connection.model<Merchant>("Merchant", schema);
};
