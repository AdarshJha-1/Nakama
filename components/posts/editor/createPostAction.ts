"use server"

import { db } from "@/db/drizzle"
import { post } from "@/db/schema"
import { getServerSession } from "@/lib/getServerSession"
import { PostWithUser } from "@/lib/types"
import { nanoid } from "nanoid"

export const createPostAction = async (content: string): Promise<PostWithUser> => {

    const session = await getServerSession()
    if (!session) throw new Error("Unauthorized")
    const user = session?.user;

    const res = await db.insert(post)
        .values(
            { content, userId: user.id, id: nanoid() })
        .returning({ id: post.id, content: post.content, createdAt: post.createdAt })
    const newPost = res[0]
    return {
        id: newPost.id,
        content: newPost.content,
        createdAt: newPost.createdAt,
        author: {
            id: user.id,
            name: user.name,
            username: user.username,
            image: user.image as string
        },
        likeCount: 0,
        bookmarkCount: 0,
        commentCount: 0
    }
}