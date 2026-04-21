import { getServerSession } from "@/lib/getServerSession";
import { createUploadthing, FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

const f = createUploadthing();

export const fileRoute = {
    avatar: f({
        image: { maxFileSize: "512KB" }
    })
        .middleware(async () => {
            const session = await getServerSession()
            if (!session?.user) {
                throw new UploadThingError("Unauthorized")
            }
            return { session.user }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const newAvatarURL = file.url.replace(
                "/f",
                `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
            )

            return newAvatarURL
        })
} satisfies FileRouter