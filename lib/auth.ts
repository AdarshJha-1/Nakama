import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                input: false,
                defaultValue: "user"
            },
            username: {
                type: "string",
                input: false,
                defaultValue: Date.now().toLocaleString()
            }
        }
    },
    plugins: [nextCookies()],
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    const base = (user.name || "user")
                        .toLowerCase()
                        .trim()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, "");
                    return {
                        data: {
                            ...user,
                            username: `${base}-${crypto.randomUUID().slice(0, 6)}`
                        }
                    }
                }
            }
        }
    }

});

export type User = typeof auth.$Infer.Session.user;