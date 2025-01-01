import { NextFunction, Request, Response } from "express";
import {
  ExpressMiddlewareInterface,
  Middleware,
  UnauthorizedError,
} from "routing-controllers";
import { injectable } from "tsyringe";

/**
 * Throws unauthorized error if request object is missing session or session.data
 */
@injectable()
@Middleware({ type: "before" })
export class IsAuth implements ExpressMiddlewareInterface {
  constructor() {}

  async use(req: Request, _res: Response, next: NextFunction) {
    if (!req.session || !req.session.user)
      throw new UnauthorizedError("Session not found");

    next();
  }
}
