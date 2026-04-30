import { db } from "@/db/drizzle";
import { media, user } from "@/db/schema";
import { getServerSession } from "@/lib/getServerSession";
import { eq } from "drizzle-orm";
import { createUploadthing, FileRouter } from "uploadthing/next"
import { UploadThingError, UTApi } from "uploadthing/server"
import { nanoid } from "nanoid"

const f = createUploadthing();

export const fileRouter = {
    avatar: f({
        image: { maxFileSize: "512KB" }
    })
        .middleware(async () => {
            const session = await getServerSession()
            if (!session?.user) {
                throw new UploadThingError("Unauthorized")
            }
            const user = session.user;
            return { user }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const oldAvatar = metadata.user.image
            const isGoogle = oldAvatar && oldAvatar?.includes("googleusercontent.com");
            if (oldAvatar && !isGoogle) {
                const key = oldAvatar.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1]
                await new UTApi().deleteFiles(key)
            }
            const newAvtarUrl = file.url.replace(
                "/f/",
                `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
            )

            await db.update(user).set({ image: newAvtarUrl }).where(eq(user.id, metadata.user.id))

            return { image: newAvtarUrl }
        }),
    attachment: f({
        image: { maxFileSize: "4MB", maxFileCount: 4 },
        video: { maxFileSize: "64MB", maxFileCount: 4 },

    })
        .middleware(async () => {
            const session = await getServerSession()
            if (!session?.user) {
                throw new UploadThingError("Unauthorized")
            }
            return {}
        })
        .onUploadComplete(async ({ file }) => {

            const [res] = await db.insert(media).values({
                id: nanoid(),
                url: file.url.replace(
                    "/f/",
                    `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
                ),
                type: file.type.startsWith("image") ? "IMAGE" : "VIDEO"
            }).returning({ id: media.id })

            return { mediaId: res.id }
        })
} satisfies FileRouter

export type AppFileRouter = typeof fileRouter