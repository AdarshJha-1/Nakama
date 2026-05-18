import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "./schema";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

type DB = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
    db: DB | undefined;
};

export const db =
    globalForDb.db ??
    drizzle(pool, { schema });

if (process.env.NODE_ENV !== "production") {
    globalForDb.db = db;
}