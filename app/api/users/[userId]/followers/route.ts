import { db } from "@/db/drizzle";
import { follow } from "@/db/schema";
import { getServerSession } from "@/lib/getServerSession";
import { FollowerInfo } from "@/lib/types";
import { and, eq, sql } from "drizzle-orm";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const session = await getServerSession();
        if (!session) {
            return Response.json({
                success: false,
                message: "Unauthorized",
            }, { status: 401 })
        }

        const { userId } = await params
        const decUserId = decodeURIComponent(userId)
        const alreadyFollow = await db.query.follow.findFirst({
            where: and(
                eq(follow.followerId, session.user.id),
                eq(follow.followingId, decUserId)
            )
        })
        const followersCount = await db
            .select({ count: sql<number>`COUNT(*)::int` })
            .from(follow)
            .where(eq(follow.followingId, decUserId))

        const data: FollowerInfo = {
            followers: followersCount[0].count,
            isFollowedByUser: !!alreadyFollow
        }
        return Response.json({
            data
        }, { status: 200 })

    } catch (error) {
        console.error(error)
        return Response.json({
            success: false,
            message: "Something went wrong",
        }, { status: 500 })
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params
        const decUserId = decodeURIComponent(userId)

        console.log("Here::::", decUserId);

        const session = await getServerSession();
        if (!session) {
            return Response.json({
                success: false,
                message: "Unauthorized",
            }, { status: 401 })
        }

        if (decUserId == session.user.id) {
            return Response.json({
                success: true,
                message: "You cannot follow yourself",
            }, { status: 400 })
        }

        await db.insert(follow).values(
            {
                followerId: session.user.id,
                followingId: decUserId
            }
        ).onConflictDoNothing();

        return Response.json({
            success: true,
            message: "user followed successfully",
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
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const session = await getServerSession();
        if (!session) {
            return Response.json({
                success: false,
                message: "Unauthorized",
            }, { status: 401 })
        }

        const { userId } = await params
        const decUserId = decodeURIComponent(userId)


        await db.delete(follow).where(and(eq(follow.followerId, session.user.id), eq(follow.followingId, decUserId)))

        return Response.json({
            success: true,
            message: "user unfollowed successfully",
        }, { status: 200 })

    } catch (error) {
        console.error(error)
        return Response.json({
            success: false,
            message: "Something went wrong",
        }, { status: 500 })
    }
}