"use server"

import { db } from "@/db/drizzle"
import { post } from "@/db/schema"
import { getServerSession } from "@/lib/getServerSession"
import { eq } from "drizzle-orm"

export const deletePostAction = async (id: string) => {
    const session = await getServerSession()
    if (!session) throw new Error("Unauthorized")

    const res = await db.delete(post).where(eq(post.id, id)).returning()
    console.log(res);
    if (!res) {
        throw new Error("Post not found")
    }
    return res[0];
}