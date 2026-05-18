import { db } from "@/db/drizzle";
import { likes, notification, post, } from "@/db/schema";
import { getServerSession } from "@/lib/getServerSession";
import { LikeInfo } from "@/lib/types";
import { and, eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
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
        WHERE ${likes.postId} = ${decPostId}) AS likes,

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


        const dbPost = await db.query.post.findFirst({
            where: eq(post.id, postId),
            columns: {
                userId: true
            }
        })
        if (!dbPost) {
            return Response.json({
                success: false,
                message: "Post not found",
            }, { status: 404 });
        }

        await db.transaction(async (tx) => {
            await db.insert(likes).values(
                {
                    postId: decPostId,
                    userId: session.user.id
                }
            ).onConflictDoNothing()

            if (dbPost.userId != session.user.id) {

                await db.insert(notification).values({
                    id: nanoid(),
                    issuerId: session.user.id,
                    recipientId: dbPost.userId,
                    type: "LIKE",
                    postId: postId
                })
            }
        })

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

        const dbPost = await db.query.post.findFirst({
            where: eq(post.id, postId),
            columns: {
                userId: true
            }
        })
        if (!dbPost) {
            return Response.json({
                success: false,
                message: "Post not found",
            }, { status: 404 });
        }


        await db.transaction(async (tx) => {
            await db.delete(likes).where(and(eq(likes.userId, session.user.id), eq(likes.postId, decPostId)))
            await db.delete(notification).where(and(eq(notification.postId, postId), eq(notification.issuerId, session.user.id), eq(notification.recipientId, dbPost.userId), eq(notification.type, "LIKE")))
        })
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