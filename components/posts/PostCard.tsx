import { PostWithUser } from "@/types/Post"
import UserProfile from "../UserProfile"
import Link from "next/link"
import { formatDate } from "@/lib/date-format";
import { Bookmark, Dot, Heart, MessageCircleIcon } from "lucide-react";
import Image from "next/image";

export default function PostCard({ post }: { post: PostWithUser }) {


    // I can fix it (her) ;) 
    const date = new Date(post.createdAt)
    const formattedDate = formatDate(date.getTime());

    return (
        <div className="min-h-28 bg-card flex items-start gap-3 rounded-2xl px-5 py-3 text-sm">
            <div className="shrink-0">
                <UserProfile user={post.author} />
            </div>
            <div className="w-full flex gap-2 flex-col">
                <div className="flex items-center justify-start">
                    <Link href={`/user/${post.author.username}`} className="w-fit flex gap-1 overflow-clip">
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
                <div className="rounded-2xl overflow-hidden ">
                    <Image src={`https://i.pinimg.com/736x/0e/53/3a/0e533a3fff16c9f3cf78472bd88a271c.jpg`} className="aspect-square rounded-2xl" alt="post-image" width={400} height={400} />
                </div>
                <div className="w-full h-fit flex justify-evenly text-muted-foreground font-light">
                    <div className="flex gap-1">
                        <MessageCircleIcon /> {post.commentCount}
                    </div>
                    <div className="flex gap-1">
                        <Heart /> {post.likeCount}
                    </div>
                    <div className="flex gap-1">
                        <Bookmark /> {post.bookmarkCount}
                    </div>
                </div>
            </div>
        </div>
    )
}


