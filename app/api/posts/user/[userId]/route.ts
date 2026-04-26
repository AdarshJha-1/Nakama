import { db } from "@/db/drizzle";
import { userFromDB } from "@/db/helper";
import { bookmarks, comments, likes, post, user } from "@/db/schema";
import { getServerSession } from "@/lib/getServerSession";
import { PostDTO, PostPage } from "@/lib/types";
import { and, desc, eq, lt, sql, } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }
) {
    const session = await getServerSession();
    if (!session) {
        return Response.json({
            success: false,
            message: "Unauthorized",
        }, { status: 401 })
    }

    const { userId } = await params;

    const pageSize = 10;
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined
    const rawPosts = await db
        .select({
            id: post.id,
            content: post.content,
            createdAt: post.createdAt,

            author: userFromDB(session.user.id),
            isLiked: sql<boolean>`
                EXISTS (
                    SELECT 1 FROM ${likes}
                    WHERE ${likes.postId} = ${post.id}
                    AND ${likes.userId} = ${session.user.id}
                )
                `,
            isBookmarked: sql<boolean>`
                EXISTS (
                    SELECT 1 FROM ${bookmarks}
                    WHERE ${bookmarks.postId} = ${post.id}
                    AND ${bookmarks.userId} = ${session.user.id}
                )
                `,
            likeCount: sql<number>`(
                SELECT COUNT(*)::int 
                FROM ${likes} 
                WHERE ${likes.postId} = ${post.id})`
                .as("like_count"),

            bookmarkCount: sql<number>`(
                SELECT COUNT(*)::int 
                FROM ${bookmarks} 
                WHERE ${bookmarks.postId} = ${post.id})`
                .as("bookmark_count"),
            commentCount: sql<number>`(
                SELECT COUNT(*)::int 
                FROM ${comments} 
                WHERE ${comments.postId} = ${post.id})`
                .as("comment_count"),
        })
        .from(post).innerJoin(user, eq(user.id, post.userId))
        .where(
            cursor
                ? and(eq(post.userId, userId), lt(post.id, cursor))
                : eq(post.userId, userId)
        )
        .limit(pageSize + 1)
        .orderBy(desc(post.id))



    const hasMore = rawPosts.length > pageSize;
    const postsToReturn = hasMore ? rawPosts.slice(0, pageSize) : rawPosts;

    const nextCursor =
        hasMore && postsToReturn.length > 0
            ? postsToReturn[postsToReturn.length - 1].id
            : null;

    const formattedPosts: PostDTO[] = postsToReturn.map(p => ({
        id: p.id,
        content: p.content,
        createdAt: p.createdAt,
        author: {
            id: p.author.id,
            name: p.author.name,
            username: p.author.username,
            image: p.author.image,
            createdAt: p.author.createdAt,


            isFollowed: p.author.isFollowing,
            followerCount: Number(p.author.followerCount),
            postCount: Number(p.author.postsCount),

        },
        isLiked: p.isLiked,
        isBookmarked: p.isBookmarked,
        likeCount: Number(p.likeCount) ?? 0,
        bookmarkCount: Number(p.bookmarkCount) ?? 0,
        commentCount: Number(p.commentCount) ?? 0,
    }));
    const data: PostPage = {
        posts: formattedPosts,
        nextCursor: nextCursor
    }
    return Response.json(data, { status: 200 })
}