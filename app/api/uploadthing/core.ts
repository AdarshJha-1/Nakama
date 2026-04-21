import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { getServerSession } from "@/lib/getServerSession";
import { createUploadthing, FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

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
            const newAvtarUrl = file.url.replace(
                "/f/",
                `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
            )

            await db.update(user).set({ image: newAvtarUrl }).where(eq(user.id, metadata.user.id))

            return { image: newAvtarUrl }
        })
} satisfies FileRouter

export type AppFileRouter = typeof fileRouter