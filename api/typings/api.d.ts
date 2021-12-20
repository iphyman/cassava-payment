import type {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyCallback,
  APIGatewayProxyResult
} from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";
import { ErrorResult } from "libs/errors";

/**
 * Create type aliasing to have naming consistency
 */
export type ApiCallback = APIGatewayProxyCallback;

export type ApiContext = Context;

export interface MiddyApiEvent<S> extends Omit<APIGatewayProxyEvent, "body"> {
  queryStringParameters: NonNullable<
    APIGatewayProxyEvent["queryStringParameters"]
  >;
  multiValueQueryStringParameters: NonNullable<
    APIGatewayProxyEvent["multiValueQueryStringParameters"]
  >;
  pathParameters: NonNullable<APIGatewayProxyEvent["pathParameters"]>;
  body: FromSchema<S>;
}

export type MiddyApiHandler<S> = (
  event: ApiEvent<S>,
  context: Context,
  callback: ApiCallback
) => void;

export type ApiEvent = APIGatewayProxyEvent;

export type ApiHandler = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback?: ApiCallback
) => Promise<void> | Promise<ApiResponse>;

export type ApiResponse = APIGatewayProxyResult;

export interface ErrorResponseBody {
  error: ErrorResult;
}
