import { MerchantController } from "./controller";
import { ApiHandler } from "../../@types";

const controller: MerchantController = new MerchantController();
export const createApiKey: ApiHandler = controller.createApiKey;
export const enableDisableApiKey: ApiHandler = controller.enableDisableApiKey;
