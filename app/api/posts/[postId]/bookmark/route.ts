import { db } from "@/db/drizzle";
import { bookmarks } from "@/db/schema";
import { getServerSession } from "@/lib/getServerSession";
import { BookmarkInfo } from "@/lib/types";
import { and, count, eq, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ postId: string }> }
) {
    const session = await getServerSession();
    if (!session) {
        return Response.json({
            success: false,
            message: "Unauthorized",
        }, { status: 401 })
    }

    const { postId } = await params;
    const decPostId = decodeURIComponent(postId)

    const res = await db.select({
        bookmarks: count(),
        isBookmarked: sql<boolean>`
            EXISTS (
            SELECT 1 
            FROM ${bookmarks}
            WHERE ${bookmarks.postId} = ${decPostId}
            AND ${bookmarks.userId} = ${session.user.id}
            )`
    }).from(bookmarks).where(eq(bookmarks.postId, postId))

    const row = res[0]

    const data: BookmarkInfo = {
        bookmarks: Number(row.bookmarks ?? 0),
        isBookmarkedByUser: row.isBookmarked === true,
    };

    return Response.json(data, { status: 200 })
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ postId: string }> }
) {
    try {
        const { postId } = await params
        const decPostId = decodeURIComponent(postId)

        const session = await getServerSession();
        if (!session) {
            return Response.json({
                success: false,
                message: "Unauthorized",
            }, { status: 401 })
        }

        await db.insert(bookmarks).values(
            {
                postId: decPostId,
                userId: session.user.id
            }
        ).onConflictDoNothing();

        return Response.json({
            success: true,
            message: "bookmarked successfully",
        }, { status: 200 })

    } catch (error) {
        console.error(error)
        return Response.json({
            success: false,
            message: "Something went wrong",
        }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ postId: string }> }
) {
    try {
        const session = await getServerSession();
        if (!session) {
            return Response.json({
                success: false,
                message: "Unauthorized",
            }, { status: 401 })
        }

        const { postId } = await params
        const decPostId = decodeURIComponent(postId)

        await db.delete(bookmarks).where(and(eq(bookmarks.userId, session.user.id), eq(bookmarks.postId, decPostId)))

        return Response.json({
            success: true,
            message: "bookmarked removed successfully",
        }, { status: 200 })

    } catch (error) {
        console.error(error)
        return Response.json({
            success: false,
            message: "Something went wrong",
        }, { status: 500 })
    }
}