import z from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const createPostSchema = z.object({
    content: requiredString
})

export const updateUserProfileSchema = z.object({
    name: requiredString,
})
export type UpdateUserProfileType = z.infer<typeof updateUserProfileSchema>