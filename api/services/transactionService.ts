import {
  mnemonicGenerate,
  mnemonicToMiniSecret,
  schnorrkelKeypairFromSeed,
  encodeAddress
} from "@polkadot/util-crypto";
import {
  EncryptCommand,
  KMSClient,
  EncryptCommandInput,
  DecryptCommand,
  DecryptCommandInput
} from "@aws-sdk/client-kms";
import { WsProvider } from "@polkadot/api";
import { Provider } from "@reef-defi/evm-provider";
import { options } from "@reef-defi/api";
import { REEF_RPC_ENDPOINT } from "../shared/constants";
import { v4 as uuidv4 } from "uuid";
import { Transaction } from "../models/transaction";
import { Wallet } from "../models/wallet";
import { DatabaseTable } from "../shared/table";
import { KMS_KEY_ID } from "../shared/constants";

export class TransactionService {
  /**
   * Function to create reef wallet account
   * Encrypt the wallet seed with AWS KMS
   * Create a pending transaction in db
   * @param amount
   * @param webhookurl
   * @param apiKey
   * @returns Promise<boolean>
   */
  public createWallet = async (
    amount: number | string,
    webhookurl: string,
    apiKey: string
  ) => {
    let response: any = null;
    const mnemonic = mnemonicGenerate(12);
    const seed = mnemonicToMiniSecret(mnemonic);
    const pair = schnorrkelKeypairFromSeed(seed);
    const address = encodeAddress(pair.publicKey, 42);

    // Encrypt with Amazon KMS
    const client = new KMSClient({ region: "us-west-2" });
    const params: EncryptCommandInput = {
      KeyId: KMS_KEY_ID,
      Plaintext: seed
    };

    const command = new EncryptCommand(params);

    try {
      const encryptedData = await client.send(command);
      const txId = uuidv4();

      const dbTransaction = await DatabaseTable.transactWrite([
        Transaction.putTransaction({
          transactionId: txId,
          apiKey,
          walletAddress: address,
          amount,
          callbackUrl: webhookurl
        }),

        Wallet.putTransaction({
          walletId: uuidv4(),
          transactionId: txId,
          address,
          privateKey: encryptedData.CiphertextBlob
        })
      ]);

      if (dbTransaction) {
        response = {
          address: address,
          transactionId: txId,
          callbackUrl: webhookurl,
          watchedAddress: true
        };
      }

      return response;
    } catch (error) {
      return false;
    }
  };

  public processTransaction = async (
    from: string,
    to: string,
    amount: number
  ) => {
    const getAddressFromDb = await Transaction.get({
      address: to,
      watchedAddress: true
    });

    // Check if extrinsic contains our watched address
    if (getAddressFromDb && getAddressFromDb.walletAddress) {
      const getColdWalletFromDb = await Wallet.get({
        transactionId: getAddressFromDb.transactionId,
        address: getAddressFromDb.walletAddress
      });

      if (getColdWalletFromDb.privateKey) {
        try {
          const client = new KMSClient({ region: "us-west-2" });

          const params: DecryptCommandInput = {
            KeyId: KMS_KEY_ID,
            CiphertextBlob: getColdWalletFromDb.privateKey
          };

          const command = new DecryptCommand(params);

          const kmsResponse = await client.send(command);
          const response = this.signTransaction(kmsResponse.Plaintext);

          const provider = new Provider(
            options({
              provider: new WsProvider(REEF_RPC_ENDPOINT)
            })
          );

          const api = await provider.api.isReady;
        } catch (error) {}
      }
    }
  };

  private signTransaction = (seed: Uint8Array | undefined) => {};
}
