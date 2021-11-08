import { ApiHandler, ApiCallback, ApiEvent } from "../../@types";
import { UserService } from "../../services/userService";
import { MerchantService } from "../../services/merchantService";
import { ResponseBuilder } from "../../shared/response";
import { UpdateApiKeyCommandInput } from "@aws-sdk/client-api-gateway";

export class MerchantController {
  /**
   * User can create multiple API keys (max. 10)
   * If this behaviour is not desireable it can be changed
   * to allow only admin to issue API keys on request of users.
   * @param event
   * @param _context
   * @param callback
   */
  public createApiKey: ApiHandler = async (event, _context, callback) => {
    const payload = JSON.parse(event.body as string);
    const token = event.headers.Authorization as string;
    const userService = new UserService();
    const decodedUserObject = await userService.getUserFromToken(token);

    if (decodedUserObject.email) {
      /**
       * Confirm that a user with the email from JWT token exists
       * Then issue a new API key
       */
      const user = await userService.getUserByEmail(decodedUserObject.email);
      if (user) {
        /**
         * Call merchant service to issue new API key to the user
         */
        const merchantService = new MerchantService();
        const response = await merchantService.issueNewApiKey(
          user.userId,
          payload.label,
          payload.wallet
        );

        ResponseBuilder.ok(response, callback);
      }
    }

    ResponseBuilder.badRequest(
      "401",
      "You are not authorized to make this request",
      callback
    );
  };

  /**
   * Route to enable or disable merchant API key
   * @param event
   * @param _context
   * @param callback
   */
  public enableDisableApiKey: ApiHandler = async (
    event,
    _context,
    callback
  ) => {
    this.isAdmin(event, callback);
    if (event.body) {
      const payload = JSON.parse(event.body);
      const merchantService = new MerchantService();

      const params: UpdateApiKeyCommandInput = {
        apiKey: payload.apiKey,
        patchOperations: [
          {
            op: "replace",
            path: "/enabled",
            value: payload.status
          }
        ]
      };

      const response = await merchantService.updateApiKey(
        params,
        payload.userId
      );

      ResponseBuilder.ok(response, callback);
    }

    ResponseBuilder.badRequest(
      "422",
      "Unprocessable entitle, please provide the required parameters",
      callback
    );
  };

  public isAdmin = async (event: ApiEvent, callback: ApiCallback) => {
    const token = event.headers.Authorization as string;
    const userService = new UserService();
    const decoded = await userService.getUserFromToken(token);

    if (decoded && decoded.email !== "opensoftweb@gmail.com") {
      /**
       * Check if the logged in user is admin
       * If true continue with the requst else
       * terminate with a bad request error
       */
      ResponseBuilder.badRequest(
        "401",
        "You are not authorized to call this endpoint",
        callback
      );
    }
  };
}
