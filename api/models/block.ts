import { Model, Schema } from "mongoose";
import { getConnection } from "libs/mongodb";

/**
 * Create schema and model to store last synced block height
 */
interface Block {
  blockchain: string;
  block_hash?: string;
  block_height: number;
}

const schema: Schema = new Schema<Block>(
  {
    blockchain: { type: String, unique: true, default: "REEF_BLOCKCHAIN" },
    block_hash: { type: String, required: false },
    block_height: { type: Number, required: true }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

export const BlockModel = async (): Promise<Model<Block>> => {
  const connection = await getConnection();

  return connection.model<Block>("BlockModel", schema);
};
