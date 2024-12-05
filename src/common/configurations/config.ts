import { env } from "@/common";

export const config = {
  serviceTag: env.SERVICE_TAG!,
  port: env.PORT!,
  corsWhitelist: env.CORS_WHITELIST!.split(","),
  databases: {
    mongodb: { url: env.MONGODB_URL! },
    redis: { url: env.REDIS_URL!, password: env.REDIS_PASS! },
  },
  googleClient: {
    id: env.GOOGLE_CLIENT_ID,
    secret: env.GOOGLE_CLIENT_SECRET,
  },
};
