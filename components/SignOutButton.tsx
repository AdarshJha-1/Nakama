"use client"

import { signOut } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function SignOutButton() {

    const router = useRouter()

    const handleSignOut = async () => {
        await signOut();
        router.push("/auth")
    }

    return (
        <Button className="w-full cursor-pointer" onClick={handleSignOut}>Sign Out</Button>
    )
}
