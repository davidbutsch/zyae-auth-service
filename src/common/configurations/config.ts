import { env } from "@/common";

export const config = {
  serviceTag: env.keys.SERVICE_TAG,
  port: env.keys.PORT,
  corsWhitelist: env.keys.CORS_WHITELIST.split(","),
  databases: {
    mongodb: { url: env.keys.MONGODB_URL },
    redis: { url: env.keys.REDIS_URL, password: env.keys.REDIS_PASS },
  },
  googleClient: {
    id: env.keys.GOOGLE_CLIENT_ID,
    secret: env.keys.GOOGLE_CLIENT_SECRET,
  },
};
