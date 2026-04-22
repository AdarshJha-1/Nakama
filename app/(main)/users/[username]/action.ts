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

    const [updatedUser] = await db.select(
        {
            id: user.id,
            name: user.name,
            username: user.username,
            image: user.image,
            createdAt: user.createdAt,
            isFollowing: sql<boolean>`
                EXISTS (
                SELECT 1 
                FROM ${follow}
                WHERE ${follow.followerId} = ${session.user.id}
                AND ${follow.followingId} = ${user.id})`,
            followerCount: sql<number>`(
                SELECT COUNT(*)::int
                FROM ${follow}
                WHERE ${follow.followingId} = ${user.id}
            )`,
            postsCount: sql<number>`(
                SELECT COUNT(*)::int
                FROM ${post}
                WHERE ${post.userId} = ${user.id}
            )`,
        }
    ).from(user).where(eq(user.id, session.user.id)).limit(1)

    return updatedUser
}