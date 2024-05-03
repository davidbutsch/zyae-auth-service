import {
  Body,
  CookieParam,
  Delete,
  JsonController,
  Post,
  Res,
} from "routing-controllers";

import { CredentialsDTO, ISessionService } from "@/modules/session";
import { inject, injectable } from "tsyringe";
import { Response } from "express";
import { sessionCookieConfig } from "@/common";

@injectable()
@JsonController("/sessions")
export class SessionController {
  constructor(
    @inject("SessionService") private sessionService: ISessionService
  ) {}

  @Post("/")
  async createSession(
    @Res() res: Response,
    @Body() credentials: CredentialsDTO
  ) {
    const newSession = await this.sessionService.createFromCredentials(
      credentials
    );

    return res
      .cookie("at", newSession.accessToken, sessionCookieConfig)
      .cookie("rt", newSession.refreshToken, sessionCookieConfig)
      .status(201)
      .json({ data: { message: "Success" } });
  }

  @Delete("/")
  async deleteSession(
    @Res() res: Response,
    @CookieParam("rt") refreshToken: string
  ) {
    await this.sessionService.deleteSessionByRefreshToken(refreshToken);

    return res
      .clearCookie("at")
      .clearCookie("rt")
      .json({ data: { message: "Success" } });
  }

  @Post("/tokens")
  async createTokens(
    @Res() res: Response,
    @CookieParam("rt") refreshToken: string
  ) {
    const refreshedSession = await this.sessionService.refreshSession(
      refreshToken
    );

    return res
      .cookie("at", refreshedSession.accessToken, sessionCookieConfig)
      .cookie("rt", refreshedSession.refreshToken, sessionCookieConfig)
      .json({ data: { message: "Success" } });
  }
}
