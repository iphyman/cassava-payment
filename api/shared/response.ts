import { ApiCallback, ApiResponse, ErrorResponseBody } from "../@types/api";
import {
  BadRequestResult,
  ConfigurationErrorResult,
  ErrorResult,
  ForbiddenResult,
  InternalServerErrorResult,
  NotFoundResult
} from "./errors";
import { ErrorCode, HttpStatusCode } from "./constants";

export class ResponseBuilder {
  public static badRequest(
    code: string,
    description: string,
    callback: ApiCallback
  ): void {
    const errorResult: BadRequestResult = new BadRequestResult(
      code,
      description
    );
    ResponseBuilder._returnAs<BadRequestResult>(
      errorResult,
      HttpStatusCode.BadRequest,
      callback
    );
  }

  public static configurationError(
    code: string,
    description: string,
    callback: ApiCallback
  ): void {
    const errorResult: ConfigurationErrorResult = new ConfigurationErrorResult(
      code,
      description
    );
    ResponseBuilder._returnAs<ConfigurationErrorResult>(
      errorResult,
      HttpStatusCode.ConfigurationError,
      callback
    );
  }

  public static forbidden(
    code: string,
    description: string,
    callback: ApiCallback
  ): void {
    const errorResult: ForbiddenResult = new ForbiddenResult(code, description);
    ResponseBuilder._returnAs<ForbiddenResult>(
      errorResult,
      HttpStatusCode.Forbidden,
      callback
    );
  }

  public static internalServerError(
    _error: Error,
    callback: ApiCallback
  ): void {
    const errorResult: InternalServerErrorResult =
      new InternalServerErrorResult(ErrorCode.GeneralError, "Sorry...");
    ResponseBuilder._returnAs<InternalServerErrorResult>(
      errorResult,
      HttpStatusCode.InternalServerError,
      callback
    );
  }

  public static notFound(
    code: string,
    description: string,
    callback: ApiCallback
  ): void {
    const errorResult: NotFoundResult = new NotFoundResult(code, description);
    ResponseBuilder._returnAs<NotFoundResult>(
      errorResult,
      HttpStatusCode.NotFound,
      callback
    );
  }

  public static ok<T>(result: T, callback: ApiCallback): void {
    ResponseBuilder._returnAs<T>(result, HttpStatusCode.Ok, callback);
  }

  private static _returnAs<T>(
    result: T,
    statusCode: number,
    callback: ApiCallback
  ): void {
    const bodyObject: ErrorResponseBody | T =
      result instanceof ErrorResult ? { error: result } : result;
    const response: ApiResponse = {
      body: JSON.stringify(bodyObject),
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      statusCode
    };

    callback(undefined, response);
  }
}
