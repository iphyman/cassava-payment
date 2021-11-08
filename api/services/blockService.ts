import { WsProvider } from "@polkadot/api";
import { Provider } from "@reef-defi/evm-provider";
import { options } from "@reef-defi/api";
import { Block } from "../models/block";
import { REEF_RPC_ENDPOINT } from "../shared/constants";
import { TransactionService } from "../services/transactionService";

export class BlockService {
  private provider: Provider;

  constructor() {
    this.provider = new Provider(
      options({
        provider: new WsProvider(REEF_RPC_ENDPOINT)
      })
    );
  }

  public syncBlocks = async (current_block_height: number) => {
    const api = await this.provider.api.isReady;

    const signed_block = await api.rpc.chain.getBlock();
    const block_header = signed_block.block.header;

    let latest_block_height = block_header.number.toNumber();
    let sync_block_height = await this.syncToLatestBlock(
      current_block_height,
      latest_block_height
    );

    return sync_block_height;
  };

  public processBlock = async (block_height: number) => {
    const api = await this.provider.api.isReady;
    const block_hash = await api.rpc.chain.getBlockHash(block_height);

    const signed_block = await api.rpc.chain.getBlock(block_hash);
    signed_block.block.extrinsics.forEach(async extrinsic => {
      const {
        isSigned,
        method: { args, method, section }
      } = extrinsic;

      if (isSigned && method === "transfer" && section === "balances") {
        //  This certainly could be a transaction
        //  process the transaction
        const transactionService = new TransactionService();
        const argsParams = args
          .map(a => a.toString())
          .join(", ")
          .split(",");

        await transactionService.processTransaction(
          extrinsic.signer.toString(),
          argsParams[0],
          parseFloat(argsParams[1])
        );

        // Update last sync block in database
        await Block.update({
          id: "LAST_PROCESSED_BLOCK",
          blockchain: "REEF_BLOCKCHAIN",
          height: block_height
        });
      }
    });
  };

  public syncToLatestBlock = async (
    index: number,
    latest_block_height: number
  ) => {
    if (index >= latest_block_height) return index;

    await this.processBlock(index + 1);

    return await this.syncToLatestBlock(index + 1, latest_block_height);
  };

  public startSyncingBlocks = async () => {
    // Get last synced block height from database
    let last_sync_block_height = await Block.get({
      id: "LAST_PROCESSED_BLOCK",
      blockchain: "REEF_BLOCKCHAIN"
    });

    last_sync_block_height = last_sync_block_height.height || 1421817;

    this.syncBlocks(last_sync_block_height);
  };
}
