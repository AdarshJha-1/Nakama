import { db } from "@/db/drizzle";
import { likes } from "@/db/schema";
import { getServerSession } from "@/lib/getServerSession";
import { LikeInfo } from "@/lib/types";
import { and, count, eq } from "drizzle-orm";
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

    console.log("for likes details");
    const { postId } = await params;
    const decPostId = decodeURIComponent(postId)
    const likeCount = await db.select({
        count: count(),
    }).from(likes).where(eq(likes.postId, decPostId))

    const isLikedByUser = await db.select().from(likes).where(eq(likes.userId, session.user.id))

    const data: LikeInfo = {
        likes: likeCount.length,
        isLikedByUser: !!isLikedByUser
    }

    console.log(data);

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