import {
  ExpressMiddlewareInterface,
  Middleware,
  NotFoundError,
} from "routing-controllers";
import { NextFunction, Request, Response } from "express";

@Middleware({ type: "after" })
export class RouteNotFoundHandler implements ExpressMiddlewareInterface {
  public use(_req: Request, res: Response, next: NextFunction): void {
    if (res.headersSent) res.end();
    else next(new NotFoundError("Route not found"));
  }
}
