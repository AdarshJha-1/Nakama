import FollowButton from '@/components/FollowButton'
import ShowFollowerCount from '@/components/FollowerCount'
import UserPosts from '@/components/users/UserPost'
import { db } from '@/db/drizzle'
import { user } from '@/db/schema'
import { getServerSession } from '@/lib/getServerSession'
import { eq } from 'drizzle-orm'
import { Metadata } from 'next'
import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'
import { cache } from 'react'
import { EditButton } from './EditButton'
import { userFromDB } from '@/db/helper'
import { UserDTO } from '@/lib/types'

interface PageProps {
    params: Promise<{
        username: string;
    }>;
}

const getUser = cache(async (username: string, loggedInUserId: string): Promise<UserDTO> => {
    const [profileUser] = await db.select(
        {
            ...userFromDB(loggedInUserId)
        }
    ).from(user).where(eq(user.username, username)).limit(1)

    if (!profileUser) notFound()
    return profileUser;
})

export async function generateMetadata(
    { params }: PageProps
): Promise<Metadata> {
    const session = await getServerSession();
    if (!session) {
        redirect("/login")
    }
    const { username } = await params;
    const decUsername = decodeURIComponent(username)

    const data = await getUser(decUsername, session.user.id);
    return {
        title: `${data.name} (@${data.username})`
    }
}

export default async function Page({ params }: PageProps) {

    const session = await getServerSession();
    if (!session) {
        redirect("/login")
    }
    const { username } = await params
    const decUsername = decodeURIComponent(username)


    const profileUser = await getUser(decUsername, session.user.id)
    if (!profileUser) {
        redirect("/")
    }

    const joinedDate = new Date(profileUser.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })

    return (
        <main className="flex w-full min-w-0 gap-5">
            <div className="w-full min-w-0 space-y-5">
                <div className="bg-card rounded-2xl p-5">
                    {profileUser?.image && <Image className="rounded-full mx-auto" src={profileUser.image as string} width={150} height={150} alt="avatar" />}
                    <div className="flex justify-between">
                        <div className="flex flex-col">
                            <h1 className='text-3xl font-bold'>{profileUser.name}</h1>
                            <span className='text-muted-foreground font-light text-sm'>@{profileUser.username}</span>
                        </div>
                        {
                            profileUser.id !== session.user.id && <FollowButton userId={profileUser.id} initialState={{ followers: profileUser.followerCount, isFollowedByUser: profileUser.isFollowed }} />
                        }
                        {
                            profileUser.id === session.user.id && <EditButton user={profileUser} />
                        }
                    </div>
                    <div className="font-light py-2 text-sm">
                        <span> Member since {joinedDate}</span>
                    </div>
                    <div className="flex gap-2 font-light py-2 text-sm">
                        <span>Posts: {profileUser.postCount}</span>
                        <ShowFollowerCount userId={profileUser.id} initialState={{ followers: profileUser.followerCount, isFollowedByUser: profileUser.isFollowed }} />
                    </div>
                </div>
                <div className="rounded-2xl bg-card p-5 shadow-sm">
                    <h2 className="text-center text-2xl font-bold">
                        {profileUser.name}&apos;s posts
                    </h2>
                </div>
                <UserPosts userId={profileUser.id} />
            </div>
        </main >)
}