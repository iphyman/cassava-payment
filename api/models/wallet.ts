import { Model, Schema, Types } from "mongoose";
import { getConnection } from "libs/mongodb";

/**
 * Create schema and model to store new created wallet address with encrypted privateKey
 */
interface Wallet {
  invoice_id: Types.ObjectId;
  merchant_id: string;
  wallet_address: string;
  private_key: string;
  transactions?: Types.DocumentArray<IWalletTransactions>;
}

interface IWalletTransactions {
  amount: number;
  type: string;
  from_wallet: string;
  to_wallet: string;
  transaction_hash: string;
  status: string;
}

const WalletTxSchema: Schema = new Schema<IWalletTransactions>(
  {
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    from_wallet: { type: String, required: true },
    to_wallet: { type: String, required: true },
    transaction_hash: { type: String, required: true },
    status: { type: String, required: false }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

const schema: Schema = new Schema<Wallet>(
  {
    invoice_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Invoice"
    },
    merchant_id: { type: String, required: true },
    wallet_address: { type: String, unique: true, required: true },
    private_key: { type: String, unique: true, required: true },
    transactions: [WalletTxSchema]
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

export const WalletModel = async (): Promise<Model<Wallet>> => {
  const connection = await getConnection();

  return connection.model<Wallet>("Wallet", schema);
};
