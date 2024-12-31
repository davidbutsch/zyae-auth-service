import { config } from "@/common";
import { Pool } from "pg";
import { URL } from "url";
import { Logger } from "./winston";

export const pool = new Pool({
  connectionString: config.databases.postgres.url,
});

const initializeConnection = async () => {
  try {
    await pool.connect();

    const url = new URL(config.databases.postgres.url);
    Logger.info(
      `Connected to postgres on address: ${url.host}:${
        url.port || "<DEFAULT_PORT>"
      }`
    );
  } catch (error) {
    Logger.error("Failed to connect to postgres");
    Logger.error(error);
  }
};

// define db schema
const setup = async () => {
  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS "user" (
      id SERIAL PRIMARY KEY,
      "displayName" VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      "passwordHash" TEXT,
      thumbnail TEXT
    );`);
  } catch (error) {
    Logger.error(`Error during db setup: ${error}`);
  }
};

initializeConnection();
setup();
