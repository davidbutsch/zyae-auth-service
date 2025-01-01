import dotenv from "dotenv";
import { defaultEnvOptions } from "./defaults";

dotenv.config();

const keys = [
  "NODE_ENV",
  "SERVICE_TAG",
  "LOG_PATH",
  "PORT",
  "CORS_WHITELIST",
  "POSTGRES_URL",
  "REDIS_URL",
  "REDIS_PASS",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "COOKIE_SECRET",
] as const; // const assert creates readonly "tuple" array
type Key = (typeof keys)[number];
export type EnvKeys = Record<Key, string>;

export class Env {
  keys: EnvKeys = {} as EnvKeys;

  // constructor & validate accept readonly arrays to allow for `keys` as a valid argument
  constructor(required: readonly Key[] | Key[] = keys) {
    this.validate(required);
  }

  validate(required: readonly Key[] | Key[]) {
    const validatedKeys: any = {};

    required.forEach((key) => {
      const value = process.env[key] || defaultEnvOptions[key];

      // check if undefined allows for empty strings
      if (value == undefined)
        throw new Error(
          `Missing environment variable "${key}" has no default, cannot start service`
        );

      validatedKeys[key] = value;
    });

    this.keys = validatedKeys;
  }
}

export const env = new Env(keys);
