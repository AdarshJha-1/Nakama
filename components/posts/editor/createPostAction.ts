"use server"

import { db } from "@/db/drizzle"
import { userFromDB } from "@/db/helper"
import { bookmarks, comments, likes, media, post, user } from "@/db/schema"
import { getServerSession } from "@/lib/getServerSession"
import { PostDTO } from "@/lib/types"
import { createPostSchema } from "@/lib/validation"
import { eq, inArray, sql } from "drizzle-orm"
import { nanoid } from "nanoid"

export const createPostAction = async (input: {
    content: string,
    mediaIds: string[]
}): Promise<PostDTO> => {

    const session = await getServerSession()
    if (!session) throw new Error("Unauthorized")

    const { content, mediaIds } = createPostSchema.parse(input)

    const [newPost] = await db.insert(post)
        .values(
            { content, userId: session.user.id, id: nanoid() })
        .returning()

    if (mediaIds.length > 0) {
        await db.update(media).set({ postId: newPost.id }).where(inArray(media.id, mediaIds))
    }

    const [p] = await db.select({
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
        .where(eq(post.id, newPost.id))
        .limit(1)

    const data: PostDTO = {
        id: p.id,
        content: p.content,
        createdAt: p.createdAt,
        author: {
            id: p.author.id,
            name: p.author.name,
            username: p.author.username,
            image: p.author.image,
            createdAt: p.author.createdAt,


            isFollowed: p.author.isFollowed,
            followerCount: Number(p.author.followerCount),
            postCount: Number(p.author.postCount),

        },
        isLiked: p.isLiked,
        isBookmarked: p.isBookmarked,
        likeCount: Number(p.likeCount) ?? 0,
        bookmarkCount: Number(p.bookmarkCount) ?? 0,
        commentCount: Number(p.commentCount) ?? 0,
    }
    return data
}