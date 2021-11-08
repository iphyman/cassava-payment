import {
  APIGatewayClient,
  CreateApiKeyCommand,
  UpdateApiKeyCommand,
  UpdateApiKeyCommandInput
} from "@aws-sdk/client-api-gateway";
import { Merchant } from "../models/merchant";

export class MerchantService {
  public issueNewApiKey = async (
    userId: string,
    label: string,
    coldWalletAddress: string
  ) => {
    const client = new APIGatewayClient({ region: "us-west-2" });
    const command = new CreateApiKeyCommand({ name: label, enabled: true });

    try {
      const apiKey = await client.send(command);
      const params = {
        merchantId: apiKey.id,
        userId,
        label,
        apiKey: apiKey.value,
        coldWalletAddress
      };

      const response = await Merchant.put(params);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Only Admin Should call this function
   * @param params
   */
  public updateApiKey = async (
    params: UpdateApiKeyCommandInput,
    userId: string
  ) => {
    const client = new APIGatewayClient({ region: "us-west-2" });
    const command = new UpdateApiKeyCommand(params);
    let response: any;

    try {
      const apiKey = await client.send(command);
      response = await Merchant.update({
        id: apiKey.id,
        sk: userId,
        enabled: apiKey.enabled
      });

      return response;
    } catch (error) {
      console.log(error);
    }
  };
}
