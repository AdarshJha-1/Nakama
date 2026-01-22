"use client"

import { signOut } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function SignOutButton() {

    const client = useQueryClient()

    const router = useRouter()

    const handleSignOut = async () => {
        client.clear()
        await signOut();
        router.push("/auth")
    }

    return (
        <Button className="w-full cursor-pointer" onClick={handleSignOut}>Sign Out</Button>
    )
}
