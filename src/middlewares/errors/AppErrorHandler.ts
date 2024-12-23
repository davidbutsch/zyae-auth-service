import { AppError, ErrorResponse } from "@/errors";
import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from "routing-controllers";
import { NextFunction, Request, Response } from "express";

import { env } from "@/common";
import { serializeError } from "serialize-error-cjs";

@Middleware({ type: "after" })
export class AppErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof AppError)) return next(error);

    const errorResponse: ErrorResponse = {
      code: error.code,
      status: error.status,
      message: error.message,
    };

    if (env.keys.NODE_ENV === "development" && error.errors.length > 0)
      errorResponse.errors = error.errors.map((error) => serializeError(error));

    res.status(errorResponse.code).json({ error: errorResponse });
  }
}
