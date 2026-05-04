"use server"

import { db } from "@/db/drizzle"
import { userFromDB } from "@/db/helper"
import { comments, user } from "@/db/schema"
import { getServerSession } from "@/lib/getServerSession"
import { CommentDTO, PostDTO } from "@/lib/types"
import { createComment } from "@/lib/validation"
import { and, eq } from "drizzle-orm"
import { nanoid } from "nanoid"

export const createCommentAction = async (input: {
    content: string,
    post: PostDTO,
}): Promise<CommentDTO> => {

    const session = await getServerSession()
    if (!session) throw new Error("Unauthorized")

    const { content: contentValidated } = createComment.parse({ content: input.content })


    const [newComment] = await db.insert(comments).values({
        id: nanoid(),
        content: contentValidated,
        postId: input.post.id,
        userId: session.user.id,
    }).returning()


    const [comment] = await db.select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        isEdited: comments.isEdited,

        author: userFromDB(session.user.id),
    })
        .from(comments).innerJoin(user, eq(user.id, comments.userId))
        .where(eq(comments.id, newComment.id))
        .limit(1)

    return comment;
}


export const deleteCommentActions = async (id: string) => {
    const session = await getServerSession()
    if (!session) throw new Error("Unauthorized")

    const res = await db.delete(comments).where(and(eq(comments.id, id), eq(comments.userId, session.user.id))).returning()
    if (!res) {
        throw new Error("Post not found")
    }
    return res[0];
} 