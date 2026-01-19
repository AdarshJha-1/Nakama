"use client"

import React from 'react'
import { DarkModeToggle } from './DarkModeToggle'
import { useSession } from '@/lib/auth-client'
import UserProfile from './UserProfile'
import SignInButton from './SignInButton'

export default function Auth() {

    const { data: session } = useSession()
    return (
        <div className="flex items-center justify-center gap-5">
            <DarkModeToggle />
            {session ? (
                <UserProfile user={session.user} />
            ) : (
                <SignInButton />
            )}
        </div>
    )
}
