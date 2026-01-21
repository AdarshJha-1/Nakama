"use client"

import { DarkModeToggle } from './DarkModeToggle'
import UserProfile from './UserProfile'
import { useSession } from '@/app/(main)/SessionProvider'

export default function Auth() {

    const { user } = useSession()
    return (
        <div className="flex items-center justify-center gap-5">
            <DarkModeToggle />
            <UserProfile user={user} />
        </div>
    )
}

