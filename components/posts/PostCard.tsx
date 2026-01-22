import { PostWithUser } from "@/types/Post"
import UserProfile from "../UserProfile"
import Link from "next/link"
import { formatDate } from "@/lib/date-format";
import { Dot } from "lucide-react";
import Image from "next/image";

export default function PostCard({ post }: { post: PostWithUser }) {


    // I can fix it (her) ;) 
    const date = new Date(post.createdAt)
    const formattedDate = formatDate(date.getTime());

    return (
        <div className="min-h-28 bg-card flex items-start gap-3 rounded-2xl px-5 py-3 text-sm">
            <div className="shrink-0">
                <UserProfile user={post.user} />
            </div>
            <div className="w-full flex gap-2 flex-col">
                <div className="flex items-center justify-start">
                    <Link href={`/user/${post.user.username}`} className="w-fit flex gap-1 overflow-clip">
                        <p className="hover:underline font-bold">{post.user.name}</p>
                        <p className="text-muted-foreground text-[18px] text-wrap">{`@${post.user.username}`}</p>
                    </Link>
                    <Dot className="text-muted-foreground" />
                    <span className="text-muted-foreground text-[18px]">{formattedDate}</span>
                </div>
                <div className="h-fit text-wrap">
                    {post.content}
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusamus sunt fugit voluptatem reiciendis, aliquid itaque facilis, sit voluptatum in totam quia excepturi voluptas dolorum dignissimos obcaecati velit quaerat numquam id rem commodi dolor, architecto quod provident? Explicabo consequuntur

                </div>
                {/* Here i will have some media attached to the post if any: This is for an example*/}
                <div className="rounded-2xl overflow-hidden ">
                    <Image src={`https://i.pinimg.com/736x/0e/53/3a/0e533a3fff16c9f3cf78472bd88a271c.jpg`} className="aspect-square rounded-2xl" alt="post-image" width={500} height={500} />

                </div>
            </div>
        </div>
    )
}