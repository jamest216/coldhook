import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined;
  db: ReturnType<typeof drizzle> | undefined;
};

const client =
  globalForDb.client ??
  postgres(process.env.DATABASE_URL!, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    max_lifetime: 60 * 30,
  });

export const db = globalForDb.db ?? drizzle(client, { schema });

if (process.env.NODE_ENV !== "production") {
  globalForDb.client = client;
  globalForDb.db = db;
}
