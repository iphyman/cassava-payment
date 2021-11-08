import { APIGatewayTokenAuthorizerHandler } from "aws-lambda";
import { sign, verify } from "jsonwebtoken";
import { compare } from "bcryptjs";
import { UserService } from "../../services/userService";
import { ResponseBuilder } from "../../shared/response";
import { ApiHandler } from "../../@types";

/**
 * Secret should be handled by AWS secret manager
 * hardcoded for simplicity
 */
const JWT_SECRET = "jwtSecretPassword";

export class AuthenticationController {
  /**
   * Create new User
   * @param event
   * @param _context
   * @param callback
   */
  public register: ApiHandler = async (
    event,
    _context,
    callback
  ): Promise<void> => {
    if (event.body) {
      const payload = JSON.parse(event.body);

      /**
       * Todo:
       * Validate required inputs
       * Send welcome email and verification code
       */
      const userService = new UserService();
      const result = await userService.createUser(payload);

      ResponseBuilder.ok(result, callback);
    }

    ResponseBuilder.badRequest(
      "422",
      "You have not provided the required parameters",
      callback
    );
  };

  /**
   * Verify that request bearer authorization token
   * was issued by the service
   * @param event
   */

  public verify: APIGatewayTokenAuthorizerHandler = (
    event,
    _context,
    callback
  ) => {
    const token = event.authorizationToken.replace("Bearer ", "");

    if (!token || event.methodArn) return callback("Unauthorized Access");

    const verified = verify(token, JWT_SECRET);

    if (verified) {
      return callback(null, this._allowPolicy(event.methodArn));
    } else {
      return callback(null, this._denyAllPolicy());
    }
  };

  private _allowPolicy = (methodArn: string) => {
    return {
      principalId: "apigateway.amazonaws.com",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: methodArn
          }
        ]
      }
    };
  };

  private _denyAllPolicy = () => {
    return {
      principalId: "*",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "*",
            Effect: "Deny",
            Resource: "*"
          }
        ]
      }
    };
  };

  /**
   * Function to login user
   * @param event
   * @param _context
   * @param callback
   */
  public login: ApiHandler = async (event, _context, callback) => {
    const payload = JSON.parse(event.body as string);

    if (payload.email && payload.password) {
      try {
        const userService = new UserService();
        const user = await userService.getUserByEmail(payload.email);

        if (user.password) {
          const passwordMatched = await compare(
            payload.password,
            user.password
          );

          if (passwordMatched) {
            const { userId, email } = user;

            const token = sign({ userId: userId, email: email }, JWT_SECRET, {
              expiresIn: "1h"
            });

            ResponseBuilder.ok(JSON.stringify({ token: token }), callback);
          }

          ResponseBuilder.badRequest(
            "400",
            "You have provided an incorrect password!",
            callback
          );
        }

        ResponseBuilder.notFound(
          "404",
          "No record found for this user",
          callback
        );
      } catch (error) {}
    }
  };
}
