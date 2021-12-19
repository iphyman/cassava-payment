import { ApiResponse, ErrorResponseBody } from "typings/api";
import {
  BadRequestResult,
  ConfigurationErrorResult,
  ErrorResult,
  ForbiddenResult,
  InternalServerErrorResult,
  NotFoundResult
} from "./errors";
import { ErrorCode, HttpStatusCode } from "libs/configs";

export class Response {
  public static badRequest(code: number, message: string): ApiResponse {
    const errorResult: BadRequestResult = new BadRequestResult(code, message);

    return Response._returnAs<BadRequestResult>(
      errorResult,
      HttpStatusCode.BadRequest
    );
  }

  public static configurationError(code: number, message: string): ApiResponse {
    const errorResult: ConfigurationErrorResult = new ConfigurationErrorResult(
      code,
      message
    );

    return Response._returnAs<ConfigurationErrorResult>(
      errorResult,
      HttpStatusCode.ConfigurationError
    );
  }

  public static forbidden(code: number, message: string): ApiResponse {
    const errorResult: ForbiddenResult = new ForbiddenResult(code, message);

    return Response._returnAs<ForbiddenResult>(
      errorResult,
      HttpStatusCode.Forbidden
    );
  }

  public static internalServerError(_error: Error): ApiResponse {
    const errorResult: InternalServerErrorResult =
      new InternalServerErrorResult(ErrorCode.GeneralError, _error.message);

    return Response._returnAs<InternalServerErrorResult>(
      errorResult,
      HttpStatusCode.InternalServerError
    );
  }

  public static notFound(code: number, message: string): ApiResponse {
    const errorResult: NotFoundResult = new NotFoundResult(code, message);

    return Response._returnAs<NotFoundResult>(
      errorResult,
      HttpStatusCode.NotFound
    );
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

  private static _returnAs<T>(result: T, statusCode: number): ApiResponse {
    const bodyObject: ErrorResponseBody | T =
      result instanceof ErrorResult
        ? { error: result, message: "error" }
        : result;

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
      body: JSON.stringify(bodyObject)
    };

    return response;
  }
}
