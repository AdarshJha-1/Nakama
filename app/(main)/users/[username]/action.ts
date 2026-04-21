"use server"

import { db } from "@/db/drizzle";
import { follow, post, user } from "@/db/schema";
import { getServerSession } from "@/lib/getServerSession";
import { updateUserProfileSchema, UpdateUserProfileType } from "@/lib/validation";
import { eq, sql } from "drizzle-orm";

export async function updateUserProfile(values: UpdateUserProfileType) {
    const validatedValues = updateUserProfileSchema.parse(values)

    const session = await getServerSession()
    if (!session?.user) {
        throw new Error("Unauthorized")
    }
    await db.update(user)
        .set({
            name: validatedValues.name
        })
        .where(eq(user.id, session.user.id))

    const [updatedUser] = await db.select({
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
        createdAt: user.createdAt,

        followerCount: sql<number>`(
            select count(*)
            from ${follow}
            where ${follow.followingId} = ${user.id}
        )`,
        postsCount: sql<number>`
          (
            select count(*) 
            from ${post}
            where ${post.userId} = ${user.id}
          )
        `, isFollowing: sql<boolean>`false`

    }).from(user).where(eq(user.id, session.user.id)).limit(1)

    return updatedUser
}