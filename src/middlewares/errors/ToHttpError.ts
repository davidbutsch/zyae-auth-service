import {
  BadRequestError,
  ExpressErrorMiddlewareInterface,
  HttpError,
  InternalServerError,
  Middleware,
} from "routing-controllers";
import { NextFunction, Request, Response } from "express";

import { ValidationError } from "class-validator";

// converts all errors to a child of HttpError
@Middleware({ type: "after" })
export class ToHttpError implements ExpressErrorMiddlewareInterface {
  error(error: any, _req: Request, _res: Response, next: NextFunction) {
    // skip conversion if already HttpError
    if (error instanceof HttpError) return next(error);

    // handle syntax error
    if (error instanceof SyntaxError)
      error = new BadRequestError(error.message);
    // handle validation error
    else if (error?.errors?.[0] instanceof ValidationError) {
      const getTargetType = (message: string) => {
        const regex = /Invalid (\w+), check 'errors' property for more info/;
        const match = message.match(regex);

        if (match && match[1]) return match[1];
      };

      const targetType = getTargetType(error.message); // e.g. ...

      error = new BadRequestError(`Bad request ${targetType}`);
    }
    // handle unknown error
    else
      error = new InternalServerError(
        error.message || "Unexpected error occured"
      );

    next(error);
  }
}
