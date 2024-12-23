import { BASE_PATH, config, defaultValidationConfig } from "@/common";
import {
  ErrorLogger,
  HttpErrorHandler,
  RequestLogger,
  RouteNotFoundHandler,
} from "@/middlewares";
import { ForbiddenError, useExpressServer } from "routing-controllers";
import express, { Express } from "express";

import { GoogleOAuth2Controller } from "@/modules/oauth2";
import { SessionController } from "@/modules/session";
import { ToHttpError } from "@/middlewares/errors/ToHttpError";
import { UserController } from "@/modules/user";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

const securityMiddleware = (app: Express) => {
  app.enable("trust proxy");
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || config.corsWhitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new ForbiddenError("Not allowed by CORS"), false);
        }
      },
      credentials: true,
    })
  );
};

const standardMiddleware = (app: Express) => {
  app.use(express.json());
  app.use(cookieParser());
};

export const app = express();

securityMiddleware(app);
standardMiddleware(app);

useExpressServer(app, {
  controllers: [UserController, SessionController, GoogleOAuth2Controller],
  routePrefix: BASE_PATH,
  defaultErrorHandler: false,
  validation: defaultValidationConfig,
  middlewares: [
    RequestLogger,
    RouteNotFoundHandler,
    ToHttpError,
    HttpErrorHandler,
    ErrorLogger,
  ],
});
