import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Tiptap from "./Editor/Tiptap";

export default async function AddPost() {

    const { userId } = await auth()
    if (!userId) {
        throw new Error("Not Authenticated")
    }
    const user = await currentUser()

    return (
        <div className="max-w-xl flex gap-3 items-start justify-start ml-5">
            <div className="rounded-full overflow-hidden">
                <Image src={user?.imageUrl as string} alt="avatar" width={"55"} height={"55"} />
            </div>
            <Tiptap />
        </div>
    )
}
