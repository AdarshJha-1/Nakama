"use server"

import { db } from "@/db/drizzle";
import { userFromDB } from "@/db/helper";
import { user } from "@/db/schema";
import { getServerSession } from "@/lib/getServerSession";
import { updateUserProfileSchema, UpdateUserProfileType } from "@/lib/validation";
import { eq } from "drizzle-orm";

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
        userFromDB(session.user.id)
    ).from(user).where(eq(user.id, session.user.id)).limit(1)

    return updatedUser
}