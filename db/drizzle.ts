import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const client = neon(process.env.DATABASE_URL as string);

type DB = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
    db: DB | undefined;
};

export const db =
    globalForDb.db ??
    drizzle(client, { schema });

if (process.env.NODE_ENV !== "production") {
    globalForDb.db = db;
}