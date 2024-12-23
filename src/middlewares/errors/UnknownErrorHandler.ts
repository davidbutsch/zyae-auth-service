import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from "routing-controllers";
import { Request, Response } from "express";

import { ErrorResponse } from "@/errors";
import { env } from "@/common";
import { serializeError } from "serialize-error-cjs";

@Middleware({ type: "after" })
export class UnknownErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, _req: Request, res: Response): void {
    const errorResponse: ErrorResponse = {
      code: 500,
      status: error.name || "InternalError",
      message: error.message || "Unexpected error occured",
    };

    if (env.keys.NODE_ENV === "development")
      errorResponse.errors = [serializeError(error)];

    res.status(500).json({ error: errorResponse });
  }
}
