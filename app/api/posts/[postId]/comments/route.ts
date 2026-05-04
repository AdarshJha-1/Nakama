import { db } from "@/db/drizzle";
import { userFromDB } from "@/db/helper";
import { comments, user } from "@/db/schema";
import { getServerSession } from "@/lib/getServerSession";
import { CommentDTO, CommentsPage } from "@/lib/types";
import { and, desc, eq, lt, or } from "drizzle-orm";
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

    const pageSize = 5;
    const rawCursor = req.nextUrl.searchParams.get("cursor");
    const parsedCursor: { createdAt?: string, id?: string } = rawCursor ? JSON.parse(decodeURIComponent(rawCursor)) : null;

    const rawComments = await db
        .select(
            {
                id: comments.id,
                content: comments.content,
                isEdited: comments.isEdited,
                createdAt: comments.createdAt,
                updatedAt: comments.updatedAt,
                author: userFromDB(session.user.id),
            }
        )
        .from(comments).innerJoin(user, eq(user.id, comments.userId))
        .where(
            parsedCursor ?
                and(
                    eq(comments.postId, decPostId),
                    or(
                        lt(comments.createdAt, new Date(parsedCursor.createdAt!)),
                        and(
                            eq(comments.createdAt, new Date(parsedCursor.createdAt!)),
                            lt(comments.id, parsedCursor.id!)
                        )
                    )
                )
                : eq(comments.postId, decPostId),
        )
        .limit(pageSize + 1)
        .orderBy(desc(comments.createdAt), desc(comments.id))

    const hasMore = rawComments.length > pageSize;
    const commentsToReturn = hasMore ? rawComments.slice(0, pageSize) : rawComments;

    const nextCursor =
        hasMore && commentsToReturn.length > 0
            ?
            JSON.stringify({
                createdAt: commentsToReturn[commentsToReturn.length - 1].createdAt,
                id: commentsToReturn[commentsToReturn.length - 1].id,
            })
            : null;


    const formattedComments: CommentDTO[] = commentsToReturn.map(c => ({
        id: c.id,
        content: c.content,
        isEdited: c.isEdited,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        author: {
            id: c.author.id,
            name: c.author.name,
            username: c.author.username,
            image: c.author.image,
            createdAt: c.author.createdAt,
            isFollowed: c.author.isFollowed,
            followerCount: Number(c.author.followerCount),
            postsCount: Number(c.author.postsCount),

        },
    }));
    const data: CommentsPage = {
        comments: formattedComments,
        nextCursor: nextCursor
    }
    return Response.json(data, { status: 200 })
}