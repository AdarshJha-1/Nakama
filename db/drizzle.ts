import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
    db: ReturnType<typeof drizzle> | undefined;
};

export const db =
    globalForDb.db ??
    (() => {
        const client = neon(process.env.DATABASE_URL as string);
        return drizzle(client, { schema });
    })();

if (process.env.NODE_ENV !== "production") {
    globalForDb.db = db;
}