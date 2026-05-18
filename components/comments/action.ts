"use server"

import { db } from "@/db/drizzle"
import { userFromDB } from "@/db/helper"
import { comments, notification, user } from "@/db/schema"
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

    const { content: contentValidated } = createComment.parse({
        content: input.content
    })

    const comment = await db.transaction(async (tx) => {

        const [newComment] = await tx.insert(comments).values({
            id: nanoid(),
            content: contentValidated,
            postId: input.post.id,
            userId: session.user.id,
        }).returning()

        if (input.post.author.id !== session.user.id) {
            await tx.insert(notification).values({
                id: nanoid(),
                issuerId: session.user.id,
                recipientId: input.post.author.id,
                postId: input.post.id,
                type: "COMMENT",
            })
        }

        const [comment] = await tx.select({
            id: comments.id,
            content: comments.content,
            createdAt: comments.createdAt,
            updatedAt: comments.updatedAt,
            isEdited: comments.isEdited,

            author: userFromDB(session.user.id),
        })
            .from(comments)
            .innerJoin(user, eq(user.id, comments.userId))
            .where(eq(comments.id, newComment.id))
            .limit(1)

        return comment
    })

    return comment
}


export const deleteCommentActions = async (id: string) => {
    const session = await getServerSession()
    if (!session) throw new Error("Unauthorized")

    const res = await db.delete(comments)
        .where(
            and(
                eq(comments.id, id),
                eq(comments.userId, session.user.id)
            )
        )
        .returning()

    if (!res.length) {
        throw new Error("Comment not found")
    }

    return res[0]
}