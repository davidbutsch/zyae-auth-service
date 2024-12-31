import {
  Get,
  JsonController,
  QueryParam,
  QueryParams,
  Redirect,
  Res,
  UnauthorizedError,
} from "routing-controllers";

import { GoogleOAuth2CallbackQuery, IOAuth2Service } from "@/modules/oauth2";
import { ISessionService } from "@/modules/session";
import { inject, injectable } from "tsyringe";

import { SERVICE_FE_HOME_URL, sessionCookieConfig } from "@/common";
import { Response } from "express";

@injectable()
@JsonController("/oauth2/google")
export class GoogleOAuth2Controller {
  constructor(
    @inject("GoogleOAuth2Service") private googleOAuth2Service: IOAuth2Service,
    @inject("SessionService") private sessionService: ISessionService
  ) {}

  @Get("/url")
  getAuthUrl(@QueryParam("redirectUrl") redirectUrl: string) {
    const url = this.googleOAuth2Service.getAuthUrl({ redirectUrl });

    return {
      data: { url },
    };
  }

  @Redirect(SERVICE_FE_HOME_URL)
  @Get("/callback")
  async callback(
    @QueryParams({ validate: { forbidNonWhitelisted: false } })
    query: GoogleOAuth2CallbackQuery,
    @Res() res: Response
  ) {
    if (query.error) throw new UnauthorizedError(query.error);
    if (!query.code) throw new UnauthorizedError("query param `code` required");

    const state = query.state ? JSON.parse(query.state) : undefined;

    const tokens = await this.googleOAuth2Service.getTokens(query.code);

    const user = await this.googleOAuth2Service.createAuthProviderUser(tokens);

    const session = await this.sessionService.create(user.id);

    res
      .cookie("at", session.accessToken, sessionCookieConfig)
      .cookie("rt", session.refreshToken, sessionCookieConfig);

    return state?.redirectUrl;
  }
}
