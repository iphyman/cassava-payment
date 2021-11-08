import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyCallback,
  APIGatewayProxyResult
} from "aws-lambda";
import { ErrorResult } from "../shared/errors";

/**
 * Create type aliasing to have naming consistency
 */
export type ApiCallback = APIGatewayProxyCallback;

export type ApiContext = Context;

export type ApiEvent = APIGatewayProxyEvent;

export type ApiHandler = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: ApiCallback
) => void;

export type ApiResponse = APIGatewayProxyResult;

export interface ErrorResponseBody {
  error: ErrorResult;
}
