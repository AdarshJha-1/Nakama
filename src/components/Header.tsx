import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import logoGirl from "../../public/logo-girl.png"
import Image from 'next/image'

export default function Header() {
    return (
        <header className="border-b">
            <div className="container mx-auto flex items-center justify-between px-4 h-16">
                <Link href="/" className="text-xl font-black flex items-center gap-1">
                    <Image src={logoGirl} alt='logo' width={70} height={70} />
                    <span className="font-extrabold text-2xl tracking-tighter  bg-gradient-to-r from-chart-5 via-primary to-accent bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(40,40,40,0.10)]">
                        Nakama
                    </span>
                </Link>
                <div className="flex items-center gap-4">
                    <SignedIn>
                        <UserButton />
                    </SignedIn>

                    <SignedOut>
                        <SignInButton>
                            <Button variant="outline">Sign In</Button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </div>
        </header>
    )
}
