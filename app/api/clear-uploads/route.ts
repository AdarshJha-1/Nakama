import { db } from "@/db/drizzle";
import { media } from "@/db/schema";
import { and, eq, inArray, isNull, lte } from "drizzle-orm";
import { NextRequest } from "next/server";
import { UTApi } from "uploadthing/server";

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization")

        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return Response.json({ error: "Invalid authorization header" }, { status: 401 })
        }
        const oneDayAgo = new Date(Date.now() - 86400000);

        const unUsedMedia = await db
            .select({
                id: media.id,
                url: media.url
            })
            .from(media)
            .where(
                process.env.NODE_ENV === "production"
                    ? and(
                        isNull(media.postId),
                        lte(media.createdAt, oneDayAgo)
                    )
                    : isNull(media.postId)
            );


        new UTApi().deleteFiles(
            unUsedMedia.map((m) =>
                m.url.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1]
            ),
        )

        if (unUsedMedia.length > 0) {
            await db.delete(media).where(
                inArray(media.id, unUsedMedia.map(m => m.id))
            )
        }
        return new Response()
    } catch (error) {
        console.log(error);
        return Response.json({ error: "Internal server error" }, { status: 500 })
    }
}


// 10 remain