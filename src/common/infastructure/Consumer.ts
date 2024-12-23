import {
  ConsumerOptions,
  ConsumerProcessor,
  StreamKeys,
  config,
  defaultConsumerOptions,
  parseReaderReply,
} from "@/common";
import { Logger, redis } from "@/libs";

import { Callback } from "ioredis";

export class Consumer {
  private processor: ConsumerProcessor;
  private options: ConsumerOptions;

  private pollingInterval: NodeJS.Timeout | null = null;
  // @ts-ignore TODO
  private lastPollMessageCount: number = 0;
  // @ts-ignore TODO
  private adaptiveIntervalMs: number;

  private isFailed: boolean = false;

  constructor(processor: ConsumerProcessor, options: ConsumerOptions) {
    const mergedOptions = { ...defaultConsumerOptions, ...options };

    this.processor = processor;
    this.options = mergedOptions;
    this.adaptiveIntervalMs = mergedOptions.ms!;
  }

  get isPolling() {
    return Boolean(this.pollingInterval);
  }

  public start() {
    if (this.isPolling)
      return Logger.warn(
        `Already polling '${this.options.streamKey}, cannot start polling'`
      );

    if (this.isFailed)
      return Logger.warn(
        `'${this.options.streamKey}' consumer failed, cannot start polling`
      );

    this.pollingInterval = setInterval(this.reader, this.options.ms);

    Logger.info(
      `Polling '${this.options.streamKey}' with an interval of ${this.options.ms} milliseconds`
    );
  }

  public stop(error?: any | null) {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }

    if (error) {
      this.isFailed = true;
      Logger.error(
        `Stopped polling '${this.options.streamKey}' with error: ${error}`
      );
    } else Logger.info(`Stopped polling '${this.options.streamKey}'`);
  }

  // 'this' in a arrow function is lexically scoped (https://stackoverflow.com/questions/16157839/typescript-this-inside-a-class-method)
  private reader = () => {
    redis.xreadgroup(
      "GROUP",
      config.serviceTag, // group id
      process.pid.toString(), // consumer id is set to process id ... i.e. only one consumer per process
      "STREAMS",
      this.options.streamKey,
      ">", // read messages following last message recieved
      this.preprocessor
    );
  };

  /**
   * Preprocessor executes before consumer processor.
   * Parses the reply and calls processor for each new message.
   * TODO Calculate new polling rate based message count if adaptiveInterval is true
   *
   * @param error The error returned from the Redis operation, if any
   * @param reply The reply from the Redis operation, typically an array of streams
   */
  private preprocessor: Callback<unknown[]> = (error, reply) => {
    if (error) return this.processor(error, null);

    let streams;

    try {
      streams = parseReaderReply(reply);
    } catch (error) {
      if (error instanceof Error) return this.processor(error, null);
      else
        return this.processor(
          new Error(`Unknown parse error occurred: ${error}`)
        );
    }

    let messageCount = 0;

    // call processor for each new message
    streams.forEach((stream) => {
      messageCount += stream.messages.length;

      stream.messages.forEach(async (message) => {
        const { options, metadata } = message;

        // skip message if emitToSelf is disabled and owner matches service tag
        if (
          !options.emitToSelf &&
          metadata.ownerServiceTag === config.serviceTag
        )
          return;

        try {
          await this.processor(null, message);
        } catch (error) {
          Logger.error(
            `Processor for message '${message?.id}' on stream '${this.options.streamKey}' failed with error: ${error}`
          );
          if (this.options.stopOnProcessError) this.stop(error);
        }
      });
    });

    this.lastPollMessageCount = messageCount;
  };

  public async groupRegistrator() {
    try {
      await redis.xgroup(
        "CREATE",
        StreamKeys.USER,
        config.serviceTag,
        "$",
        "MKSTREAM"
      );
    } catch (error: any) {
      if (error?.message === "BUSYGROUP Consumer Group name already exists")
        Logger.warn(
          `Redis consumer group '${config.serviceTag}' already registered`
        );
      else this.stop(error);
    }
  }
}
