"use client"

import Image from "next/image";
import { MessageCircleIcon } from "lucide-react";
import Link from "next/link"

import PostMore from "./PostMore";
import { PostDTO } from "@/lib/types"
import { formatDate } from "@/lib/date-format";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/(main)/SessionProvider";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import { Separator } from "../ui/separator";

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
        <div className="min-h-28 bg-card flex flex-col rounded-2xl py-5 px-5 space-y-3">
            <div className="flex justify-between items-center">
                <div className="flex gap-3 items-start text-sm ">
                    <div className="shrink-0">
                        <Link href={`/users/${post.author.username}`} className="">
                            <Image className="rounded-full aspect-square flex-none object-cover h-fit" src={post.author.image as string} width={50} height={50} alt="avatar" />
                        </Link>
                    </div>
                    <div className="flex items-center justify-start">
                        <div className="">
                            <Link href={`/users/${post.author.username}`} className="w-fit flex gap-1 overflow-clip">
                                <p className="hover:underline font-bold">{post.author.name}</p>
                            </Link>
                            <span className="text-muted-foreground text-[18px]">{formattedDate}</span>
                        </div>
                    </div>
                </div>
                {
                    post.author.id === session?.userId && <PostMore id={post.id} />
                }
            </div>
            <div className="w-full flex space-y-3 flex-col">
                <div className="h-fit text-wrap">
                    {post.content}
                </div>
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
                <Separator className="bg-muted" />
                <div className="w-full h-fit flex justify-between text-muted-foreground font-light">
                    <div className="flex space-x-4">
                        <LikeButton postId={post.id} initialState={{ likes: post.likeCount, isLikedByUser: post.isLiked }} />
                        <div className="flex items-center justify-center space-x-2">
                            <MessageCircleIcon className="size-5" /> <span className="text-sm font-medium">{post.commentCount} Comments</span>
                        </div>
                    </div>
                    <BookmarkButton postId={post.id} initialState={{ bookmarks: post.bookmarkCount, isBookmarkedByUser: post.isBookmarked }} />
                </div>
            </div>
        </div >
    )
}