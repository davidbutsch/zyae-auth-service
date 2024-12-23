import { ConsumerOptions, MessageOptions } from "@/common";

import { EnvKeys } from "./env";
import { StreamKeys } from ".";

export const defaultEnvOptions: Partial<EnvKeys> = {
  NODE_ENV: "production",
  LOG_PATH: "./logs",
};

export const defaultValidationConfig = {
  whitelist: true,
  forbidNonWhitelisted: true,
};

export const defaultConsumerOptions: ConsumerOptions = {
  streamKey: StreamKeys.DEFAULT,
  ms: 5000,
  adaptiveInterval: true,
  stopOnProcessError: false,
};

export const defaultProducerAppendOptions: MessageOptions = {
  emitToSelf: false,
};
