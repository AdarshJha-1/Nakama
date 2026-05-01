import { db } from "@/db/drizzle";
import { likes } from "@/db/schema";
import { getServerSession } from "@/lib/getServerSession";
import { LikeInfo } from "@/lib/types";
import { and, eq, sql } from "drizzle-orm";
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
    const dbRes = await db.execute(sql`
        SELECT 
        (
        SELECT COUNT(*)
        FROM ${likes}
        WHERE ${likes.postId} = ${decPostId}
        ) AS likes,

        EXISTS (
        SELECT 1 
        FROM ${likes}
        WHERE ${likes.postId} = ${decPostId}
        AND ${likes.userId} = ${session.user.id}
        ) AS isLiked
`);

    const row = dbRes.rows[0];

    const data: LikeInfo = {
        likes: Number(row?.likes ?? 0),
        isLikedByUser: row?.isLiked === true,
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

        await db.insert(likes).values(
            {
                postId: decPostId,
                userId: session.user.id
            }
        ).onConflictDoNothing();

        return Response.json({
            success: true,
            message: "liked successfully",
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


        await db.delete(likes).where(and(eq(likes.userId, session.user.id), eq(likes.postId, decPostId)))

        return Response.json({
            success: true,
            message: "liked removed successfully",
        }, { status: 200 })

    } catch (error) {
        console.error(error)
        return Response.json({
            success: false,
            message: "Something went wrong",
        }, { status: 500 })
    }
}