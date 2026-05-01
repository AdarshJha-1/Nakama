import { db } from "@/db/drizzle";
import { media } from "@/db/schema";
import { and, inArray, isNull, lte } from "drizzle-orm";
import { NextRequest } from "next/server";
import { UTApi } from "uploadthing/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const secret = searchParams.get("secret");

        if (secret !== process.env.CRON_SECRET) {
            return Response.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const oneDayAgo = new Date(Date.now() - 86400000);

        const unUsedMedia = await db
            .select({
                id: media.id,
                url: media.url,
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

        const fileKeys = unUsedMedia
            .map((m) =>
                m.url.split(
                    `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
                )[1]
            )
            .filter(Boolean);

        if (fileKeys.length > 0) {
            await new UTApi().deleteFiles(fileKeys);
        }

        if (unUsedMedia.length > 0) {
            await db.delete(media).where(
                inArray(
                    media.id,
                    unUsedMedia.map((m) => m.id)
                )
            );
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error(error);
        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}