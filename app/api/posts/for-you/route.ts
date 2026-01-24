import { db } from "@/db/drizzle";
import { bookmarks, comments, likes, post, user } from "@/db/schema";
import { getServerSession } from "@/lib/getServerSession";
import { desc, eq, lt, sql, } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getServerSession();
    if (!session) {
        return Response.json({
            success: false,
            message: "Unauthorized",
        }, { status: 401 })
    }

    const pageSize = 10;

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined

    const rawPosts = await db
        .select({
            id: post.id,
            content: post.content,
            createdAt: post.createdAt,

            authorId: user.id,
            authorName: user.name,
            authorUsername: user.username,
            authorImage: user.image,

            likeCount: sql<number>`(SELECT COUNT(*) FROM ${likes} WHERE ${likes.postId} = ${post.id})`.as("like_count"),
            bookmarkCount: sql<number>`(SELECT COUNT(*) FROM ${bookmarks} WHERE ${bookmarks.postId} = ${post.id})`.as("bookmark_count"),
            commentCount: sql<number>`(SELECT COUNT(*) FROM ${comments} WHERE ${comments.postId} = ${post.id})`.as("comment_count"),
        })
        .from(post).innerJoin(user, eq(user.id, post.userId))
        .where(cursor ? lt(post.createdAt, new Date(cursor)) : undefined)
        .limit(pageSize + 1)
        .orderBy(desc(post.createdAt))



    const hasMore = rawPosts.length > pageSize;
    const postsToReturn = hasMore ? rawPosts.slice(0, pageSize) : rawPosts;

    const nextCursor =
        hasMore && postsToReturn.length > 0
            ? postsToReturn[postsToReturn.length - 1].createdAt.toISOString()
            : null;

    const formattedPosts = postsToReturn.map(p => ({
        id: p.id,
        content: p.content,
        createdAt: p.createdAt,
        author: {
            id: p.authorId,
            name: p.authorName,
            username: p.authorUsername,
            image: p.authorImage,
        },
        likeCount: Number(p.likeCount) ?? 0,
        bookmarkCount: Number(p.bookmarkCount) ?? 0,
        commentCount: Number(p.commentCount) ?? 0,
    }));
    return Response.json({
        success: true,
        posts: formattedPosts,
        nextCursor,
    }, { status: 200 })
}