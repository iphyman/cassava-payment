import {
  APIGatewayClient,
  CreateApiKeyCommand,
  CreateUsagePlanKeyCommand,
  UpdateApiKeyCommand
} from "@aws-sdk/client-api-gateway";
import { v4 as uuidv4, v1 as uuidv1 } from "uuid";
import type { CreateApiKeyPayload } from "libs/schemas/createApiKeySchema";
import { Merchant, MerchantModel } from "models/merchant";
import { AWS_REGION, USAGE_PLANS } from "libs/constants";

export class MerchantApiKey {
  private client: APIGatewayClient;

  constructor() {
    this.client = new APIGatewayClient({ region: AWS_REGION });
  }

  public createKey = async (
    payload: CreateApiKeyPayload
  ): Promise<Merchant | null> => {
    let response: Merchant | null = null;

    const { cold_wallet_address, user_id, label, description } = payload;
    const merchant_id = uuidv1();
    const merchantKey = uuidv4();
    const enabled = true;
    const merchantModel = await MerchantModel();

    const command = new CreateApiKeyCommand({
      name: label,
      description,
      enabled,
      value: merchantKey
    });

    //TODO: limit number of API key a single user can create to 5 or 10

    try {
      const apiKey = await this.client.send(command);

      if (!apiKey || !apiKey.value) return response;

      const addToUsagePlan = new CreateUsagePlanKeyCommand({
        keyId: apiKey.id,
        keyType: "API_KEY",
        usagePlanId: USAGE_PLANS.pro
      });

      await this.client.send(addToUsagePlan);

      response = await new merchantModel({
        merchant_id,
        user_id,
        api_key: apiKey.value,
        label,
        description,
        enabled: true,
        cold_wallet_address
      }).save();
    } catch (error) {
      //TODO: better error reporting to the caller|dev
      return response;
    }

    return response;
  };

  public enableDisableKey = async (
    payload: string
  ): Promise<Merchant | null> => {
    let response: Merchant | null = null;

    const merchantModel = await MerchantModel();
    const key = await merchantModel.findOne({ api_key: payload });

    if (!key || !key.api_key) return null;

    const command = new UpdateApiKeyCommand({
      apiKey: key.api_key,
      patchOperations: [
        {
          op: "replace",
          path: "/enabled",
          value: key.enabled ? "false" : "true"
        }
      ]
    });

    try {
      const apiKey = await this.client.send(command);
      if (apiKey.enabled)
        // TODO: filter what is returned to the client
        response = await key.updateOne({ enabled: apiKey.enabled }).exec();

      return response;
    } catch (error) {
      //TODO: better error reporting to the caller|dev
      return response;
    }
  };
}
