"use client"

import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Tiptap from "./Editor/Tiptap";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function AddPost() {

    const router = useRouter()
    const { user, isSignedIn, isLoaded } = useUser()

    return (
        <div className="max-w-xl flex gap-3 items-start justify-start ml-5">
            <div className="rounded-full overflow-hidden">
                {user?.imageUrl && <Image src={user?.imageUrl as string} alt="avatar" width={"55"} height={"55"} />
                }            </div>
            <Tiptap />
        </div>
    )
}
