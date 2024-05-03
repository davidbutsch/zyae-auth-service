import {
  AppErrorHandler,
  ErrorLogger,
  RequestLogger,
  RouteNotFoundHandler,
  SyntaxErrorHandler,
  UnknownErrorHandler,
  ValidationErrorHandler,
} from "@/middlewares";
import { BASE_PATH, config, defaultValidationConfig } from "@/common";
import express, { Express } from "express";

import { AppError } from "@/errors";
import { GoogleOAuth2Controller } from "@/modules/oauth2";
import { SessionController } from "@/modules/session";
import { StatusCodes } from "http-status-codes";
import { UserController } from "@/modules/user";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { useExpressServer } from "routing-controllers";

const securityMiddleware = (app: Express) => {
  app.enable("trust proxy");
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || config.corsWhitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(
            new AppError(StatusCodes.FORBIDDEN, "Not allowed by CORS"),
            false
          );
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
    ErrorLogger,
    AppErrorHandler,
    SyntaxErrorHandler,
    ValidationErrorHandler,
    UnknownErrorHandler,
  ],
});
