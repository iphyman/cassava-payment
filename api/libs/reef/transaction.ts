import { Keyring, WsProvider, ApiPromise } from "@polkadot/api";
import { options } from "@reef-defi/api";
import { REEF_RPC_ENDPOINT } from "libs/configs";
import { KMS } from "libs/kms";
import { WalletModel } from "models/wallet";
import { MerchantModel } from "models/merchant";
import { BlockModel } from "models/block";
import { InvoiceModel } from "models/invoice";

export class ReefTransaction {
  private kms: KMS;
  private api: ApiPromise;

  constructor() {
    this.kms = new KMS();
    const provider = new WsProvider(REEF_RPC_ENDPOINT);
    this.api = new ApiPromise(options({ provider }));
  }

  public processTransaction = async (
    wallet_address: string,
    amount: string,
    from_address: string
  ): Promise<void> => {
    const invoiceModel = await InvoiceModel();
    const watchedAddress = await invoiceModel.findOne({
      wallet_address,
      watched_address: true
    });

    //Return if not watched address
    if (!watchedAddress) return;

    const walletModel = await WalletModel();
    const wallet = await walletModel.findOne({ wallet_address });

    if (!wallet) return;

    const merchantModel = await MerchantModel();
    const merchant = await merchantModel
      .findOne({
        merchant_id: wallet.merchant_id
      })
      .lean();
    const decoded = await this.kms.decrypt(wallet.private_key);

    if (!decoded || !decoded.Plaintext || !merchant) return;

    const mnemonic = decoded.Plaintext.toString();
    const receipient = merchant.cold_wallet_address;
    const txHash = await this.signTransaction(mnemonic, amount, receipient);

    //Log transfer to merchant in db
    wallet.transactions?.push({
      amount,
      type: "settlement",
      from_wallet: from_address, //Customer wallet address
      to_wallet: receipient, //Merchant cold wallet
      transaction_hash: txHash
    });

    await wallet.save();
    await watchedAddress
      .updateOne({
        watched_address: false
      })
      .exec();

    await watchedAddress.updateOne({
      watched_address: false,
      status: "paid",
      amount_paid: amount
    });
  };

  private signTransaction = async (
    mnemonic: string,
    amount: string,
    receipient: string
  ): Promise<string> => {
    await this.api.isReady;
    const keyring = new Keyring({ type: "sr25519" });
    const fromAccount = keyring.addFromMnemonic(mnemonic);
    const txHash = await this.api.tx.balances
      .transfer(receipient, amount)
      .signAndSend(fromAccount);

    //Clean pair dictionary not necessary as lambda is stateless
    keyring.removePair(fromAccount.address);

    return txHash.toString();
  };

  private _syncBlocks = async (
    currentBlockHeight: number
  ): Promise<void | number> => {
    await this.api.isReady;

    const signedBlock = await this.api.rpc.chain.getBlock();
    const blockHeader = signedBlock.block.header;

    const latestBlockHeight = blockHeader.number.toNumber();
    const syncBlockHeight = await this._syncToLatestBlock(
      currentBlockHeight,
      latestBlockHeight
    );

    return syncBlockHeight;
  };

  private _processBlock = async (blockHeight: number): Promise<void> => {
    await this.api.isReady;
    const blockHash = await this.api.rpc.chain.getBlockHash(blockHeight);

    const signedBlock = await this.api.rpc.chain.getBlock(blockHash);
    signedBlock.block.extrinsics.forEach(async extrinsic => {
      const {
        isSigned,
        method: { args, method, section }
      } = extrinsic;

      if (
        isSigned &&
        section === "balances" &&
        method === "transferKeepAlive" //TODO: consider method="transfer"
      ) {
        //  This certainly {could} be a transaction
        //  check if it's a watched address and process
        const transaction: string[] = args.map(a => a.toString());
        const toAddress = transaction[0];
        const fromAddress = extrinsic.signer.toString();
        const amount = transaction[1];

        await this.processTransaction(toAddress, amount, fromAddress);

        // Update last synced block in database
        const blockModel = await BlockModel();
        await blockModel
          .findOneAndUpdate(
            { blockchain: "REEF_BLOCKCHAIN" },
            {
              block_height: blockHeight
            },
            { upsert: true, returnOriginal: false }
          )
          .exec();
      }
    });
  };

  private _syncToLatestBlock = async (
    index: number,
    latestBlockHeight: number
  ): Promise<number | void> => {
    if (index >= latestBlockHeight) return index;

    await this._processBlock(index + 1);

    return await this._syncToLatestBlock(index + 1, latestBlockHeight);
  };

  public startSyncingBlocks = async (): Promise<void> => {
    let lastSyncedBlockHeight = 1421817;

    const blockModel = await BlockModel();
    const blockHeightFromDb = await blockModel
      .findOne({
        blockchain: "REEF_BLOCKCHAIN"
      })
      .lean();

    if (blockHeightFromDb) {
      lastSyncedBlockHeight = blockHeightFromDb.block_height;
    }

    this._syncBlocks(lastSyncedBlockHeight);
  };
}
