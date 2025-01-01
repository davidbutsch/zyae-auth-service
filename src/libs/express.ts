import {
  BASE_PATH,
  config,
  defaultValidationConfig,
  env,
  sessionCookieConfig,
} from "@/common";
import {
  ErrorLogger,
  HttpErrorHandler,
  RequestLogger,
  RouteNotFoundHandler,
} from "@/middlewares";
import express, { Express } from "express";
import { ForbiddenError, useExpressServer } from "routing-controllers";

import { ToHttpError } from "@/middlewares/errors/ToHttpError";
import { GoogleOAuth2Controller } from "@/modules/oauth2";
import { SessionController } from "@/modules/session";
import { UserController } from "@/modules/user";
import { RedisStore } from "connect-redis";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import helmet from "helmet";
import { Logger, redis } from ".";

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

// express session + redis store
app.use(
  session({
    store: new RedisStore({ client: redis }),
    secret: env.keys.COOKIE_SECRET,
    cookie: sessionCookieConfig,
    resave: false,
    saveUninitialized: false,
  })
);

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

app.listen(config.port, () => {
  Logger.info(`HTTP server listening on port ${config.port}`);
});
