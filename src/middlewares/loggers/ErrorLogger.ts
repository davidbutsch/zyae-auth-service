import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from "routing-controllers";
import { Request, Response } from "express";

import { Logger } from "@/libs";

@Middleware({ type: "after" })
export class ErrorLogger implements ExpressErrorMiddlewareInterface {
  error(error: any, _req: Request, res: Response): void {
    Logger.error(error);
    res.end();
  }
}
