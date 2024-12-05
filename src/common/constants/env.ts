import dotenv from "dotenv";
import { defaultEnvOptions } from "./defaults";

dotenv.config();

export class ENV {
  public NODE_ENV: string;
  public SERVICE_TAG: string;
  public LOG_PATH: string;
  public PORT: string;
  public CORS_WHITELIST: string;
  public MONGODB_URL: string;
  public REDIS_URL: string;
  public REDIS_PASS: string;
  public GOOGLE_CLIENT_ID: string;
  public GOOGLE_CLIENT_SECRET: string;

  private readonly keys: (keyof ENV)[];

  constructor() {
    this.keys = [
      "NODE_ENV",
      "SERVICE_TAG",
      "LOG_PATH",
      "PORT",
      "CORS_WHITELIST",
      "MONGODB_URL",
      "REDIS_URL",
      "REDIS_PASS",
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
    ];

    this.loadENV();
  }

  private loadENV = () => {
    this.keys.forEach((key) => {
      // service aborts for any missing environment variables so we can safely cast as string
      this[key] = process.env[key] || (defaultEnvOptions[key] as string);

      if (this[key] === undefined) {
        throw new Error(
          `Missing environment variable "${key}" has no default, cannot start service`
        );
      }
    });
  };
}

export const env: ENV = new ENV();
