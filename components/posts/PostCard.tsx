"use client"

import Image from "next/image";
import { Bookmark, Dot, Heart, MessageCircleIcon } from "lucide-react";
import Link from "next/link"

import PostMore from "./PostMore";
import { PostDTO } from "@/lib/types"
import { formatDate } from "@/lib/date-format";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/(main)/SessionProvider";
import LikeButton from "../LikeButton";

export default function PostCard({ post }: { post: PostDTO }) {

    const { session } = useSession()
    const router = useRouter()
    if (!session) {
        router.push("/auth")
        return
    }
    const date = new Date(post.createdAt)
    const formattedDate = formatDate(date.getTime());

    return (
        <div className="min-h-28 bg-card flex items-start gap-3 rounded-2xl px-5 py-3 text-sm">
            <div className="shrink-0">
                <Link href={`/users/${post.author.username}`} className="">
                    <Image className="rounded-full aspect-square flex-none object-cover h-fit" src={post.author.image as string} width={50} height={50} alt="avatar" />
                </Link>
            </div>
            <div className="w-full flex gap-2 flex-col">
                <div className="flex items-center justify-start">
                    <Link href={`/users/${post.author.username}`} className="w-fit flex gap-1 overflow-clip">
                        <p className="hover:underline font-bold">{post.author.name}</p>
                        <p className="text-muted-foreground text-[18px] text-wrap">{`@${post.author.username}`}</p>
                    </Link>
                    <Dot className="text-muted-foreground" />
                    <span className="text-muted-foreground text-[18px]">{formattedDate}</span>
                </div>
                <div className="h-fit text-wrap">
                    {post.content}
                </div>
                {/* Here i will have some media attached to the post if any: This is for an example*/}
                <div className="rounded-2xl  overflow-hidden ">
                    <div className="relative w-full aspect-square max-w-2/4">
                        <Image
                            src="https://i.pinimg.com/736x/ce/bc/5a/cebc5ae1a5dc66e170449765a4458503.jpg"
                            alt="post-image"
                            fill
                            className="object-cover rounded-2xl"
                        />
                    </div>
                </div>
                <div className="w-full h-fit flex justify-evenly text-muted-foreground font-light">
                    <div className="flex gap-1">
                        <MessageCircleIcon /> {post.commentCount}
                    </div>
                    <LikeButton postId={post.id} initialState={{ likes: post.likeCount, isLikedByUser: post.isLiked }} />
                    <div className="flex gap-1">
                        <Bookmark /> {post.bookmarkCount}
                    </div>
                    {
                        post.author.id === session?.userId && <PostMore id={post.id} />
                    }
                </div>
            </div>
        </div >
    )
}