import { env, logFileTransportConfig } from "@/common";

import winston from "winston";

const transports = [];

const consoleTransport = new winston.transports.Console({
  format:
    env.keys.NODE_ENV === "development"
      ? winston.format.combine(winston.format.cli(), winston.format.splat())
      : undefined,
});
const combinedFileTransport = new winston.transports.File(
  logFileTransportConfig.combined
);
const errorFileTransport = new winston.transports.File(
  logFileTransportConfig.error
);

transports.push(consoleTransport, errorFileTransport, combinedFileTransport);

export const Logger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports,
});
