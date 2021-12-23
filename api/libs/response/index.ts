import { ApiResponse } from "typings/api";
import { HttpStatusCode } from "libs/configs";

export class Response {
  public static badRequest(message: string): ApiResponse {
    return Response._returnAs(HttpStatusCode.BadRequest, message);
  }

  public static configurationError(message: string): ApiResponse {
    return Response._returnAs(HttpStatusCode.ConfigurationError, message);
  }

  public static forbidden(message: string): ApiResponse {
    return Response._returnAs(HttpStatusCode.Forbidden, message);
  }

  public static error(code: number, message: string): ApiResponse {
    return Response._returnAs(code, message);
  }

  // public static internalServerError(_error: Error): ApiResponse {
  //   return Response._returnAs(
  //     HttpStatusCode.InternalServerError,
  //     "internal server error"
  //   );
  // }

  public static notFound(message: string): ApiResponse {
    return Response._returnAs(HttpStatusCode.NotFound, message);
  }

  public static ok<T>(result: T): ApiResponse {
    return {
      statusCode: HttpStatusCode.Ok,
      body: JSON.stringify({
        data: result,
        message: "success"
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      }
    };
  }

  private static _returnAs(
    statusCode: number,
    description: string
  ): ApiResponse {
    const response: ApiResponse = {
      statusCode,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "OPTIONS,POST,DELETE,GET",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
        "X-Requested-With": "*"
      },
      body: JSON.stringify({
        error: {
          code: statusCode,
          message: description
        },
        message: "error"
      })
    };

    return response;
  }
}
