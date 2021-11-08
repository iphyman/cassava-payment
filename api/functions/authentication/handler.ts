import { AuthenticationController } from "./controller";
import { ApiHandler } from "../../@types";

const controller: AuthenticationController = new AuthenticationController();

export const verify = controller.verify;
export const register: ApiHandler = controller.register;
export const login: ApiHandler = controller.login;
