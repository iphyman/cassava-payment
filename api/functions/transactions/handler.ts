import { TransactionController } from "./controller";
import { ApiHandler } from "../../@types";

const controller = new TransactionController();
export const createTransaction: ApiHandler = controller.createTransaction;
