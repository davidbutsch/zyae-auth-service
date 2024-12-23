import {
  ExpressMiddlewareInterface,
  Middleware,
  UnauthorizedError,
} from "routing-controllers";
import { ISessionRepository, ISessionService } from "@/modules/session";
import { NextFunction, Request, Response } from "express";
import { container, injectable } from "tsyringe";

@injectable()
@Middleware({ type: "before" })
export class AttachSession implements ExpressMiddlewareInterface {
  private sessionRepository: ISessionRepository;
  private sessionService: ISessionService;

  constructor() {
    this.sessionRepository = container.resolve("SessionRepository");
    this.sessionService = container.resolve("SessionService");
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies.at;
    const session = await this.sessionRepository.findByAccessToken(accessToken);

    if (!session) throw new UnauthorizedError("Session not found");

    const isExpired = this.sessionService.isSessionExpired(session);
    if (isExpired) throw new UnauthorizedError("Session access expired");

    res.locals.session = session;

    next();
  }
}
