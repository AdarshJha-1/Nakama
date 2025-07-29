import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import logoGirl from "../../public/logo-girl.png"
import Image from 'next/image'
import { ModeToggle } from './ThemeToggleButton'

export default function Header() {
    return (
        <header className="border-b bg-background sticky top-0">
            <div className="container mx-auto flex items-center justify-between px-4 h-16">
                <Link href="/" className="text-xl font-black flex items-center gap-1">
                    <Image src={logoGirl} alt='logo' width={70} height={70} />
                    <span className="font-extrabold text-2xl text-primary dark:text-chart-2 tracking-tighter ">
                        Nakama
                    </span>
                </Link>
                <div className="flex items-center gap-4">
                    <ModeToggle />
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
