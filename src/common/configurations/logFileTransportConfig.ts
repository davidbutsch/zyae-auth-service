import { env } from "@/common";

export const logFileTransportConfig = {
  combined: {
    filename: `${env.keys.LOG_PATH}/${env.keys.NODE_ENV}/combined.${env.keys.NODE_ENV}.log`,
    level: "verbose",
  },
  error: {
    filename: `${env.keys.LOG_PATH}/${env.keys.NODE_ENV}/error.${env.keys.NODE_ENV}.log`,
    level: "error",
    handleExceptions: false,
    handleRejections: false,
  },
};
