"use client"

import { signIn } from "@/lib/auth-client";
import { Button } from "./ui/button";

export default function SignInButton() {
    return (
        <Button className="w-25 h-10" variant={"outline"} onClick={() => signIn.social({
            provider: "google",
            callbackURL: "/"
        })}>Sign In</Button>
    )
}