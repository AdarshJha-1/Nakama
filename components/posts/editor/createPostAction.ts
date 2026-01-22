"use server"

import { db } from "@/db/drizzle"
import { post } from "@/db/schema"
import { getServerSession } from "@/lib/getServerSession"
import { nanoid } from "nanoid"

export const createPostAction = async ({ content }: { content: string }) => {

    const session = await getServerSession()
    if (!session) throw new Error("Unauthorized")
    const user = session?.user;

    await db.insert(post).values({ content, userId: user.id, id: nanoid() })
    return;
}