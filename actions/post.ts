"use server"

import { db } from "@/db/drizzle"
import { post } from "@/db/schema"

const getPosts = async () => {
    const posts = await db.select().from(post);
}