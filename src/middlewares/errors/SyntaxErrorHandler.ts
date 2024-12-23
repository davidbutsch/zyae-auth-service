import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from "routing-controllers";
import { NextFunction, Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

import { ErrorResponse } from "@/errors";
import { env } from "@/common";
import { serializeError } from "serialize-error-cjs";

@Middleware({ type: "after" })
export class SyntaxErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof SyntaxError)) return next(error);

    const errorResponse: ErrorResponse = {
      code: StatusCodes.BAD_REQUEST,
      status: getReasonPhrase(StatusCodes.BAD_REQUEST),
      message: error.message,
    };

    if (env.keys.NODE_ENV === "development")
      errorResponse.errors = [serializeError(error)];

    res.status(errorResponse.code).json({ error: errorResponse });
  }
}
