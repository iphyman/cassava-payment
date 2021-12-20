import {
  mnemonicGenerate,
  mnemonicToMiniSecret,
  encodeAddress,
  cryptoWaitReady,
  sr25519PairFromSeed
} from "@polkadot/util-crypto";
import { KMS } from "libs/kms";
import type { ICreateWallet } from "typings/reef";

export class ReefWallet {
  private kms: KMS;

  constructor() {
    this.kms = new KMS();
  }

  public createWallet = async (): Promise<ICreateWallet> => {
    await cryptoWaitReady();
    const mnemonic = mnemonicGenerate(12);
    const seed = mnemonicToMiniSecret(mnemonic);
    const pair = sr25519PairFromSeed(seed);

    const address = encodeAddress(pair.publicKey, 42);
    const encrypted = await this.kms.encrypt(mnemonic);

    if (encrypted && encrypted.CiphertextBlob) {
      const encryptedPrivateKey = encrypted.CiphertextBlob.toString();

      return { wallet_address: address, private_key: encryptedPrivateKey };
    }

    return null;
  };
}
