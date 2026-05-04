import { CommentDTO } from "@/lib/types"
import Image from "next/image"
import { formatDate } from "@/lib/date-format"
import { useSession } from "@/app/(main)/SessionProvider"
import Link from "next/link"
import CommentMoreButton from "./CommentMoreButton"

interface CommentProps {
    comment: CommentDTO
}

export default function Comment({ comment }: CommentProps) {

    const session = useSession()

    return (
        <div className="group/comment flex gap-3 py-3">
            <span className="">
                <Link href={`/users/${comment.author.username}`}>
                    <Image src={comment.author.image as string} className="rounded-full" alt="user-pfp" width={40} height={40} />
                </Link>
            </span>
            <div className="text-[16px] sm:text-sm">
                <div className="flex items-center gap-1">
                    <Link
                        href={`/users/${comment.author.username}`}
                        className="font-medium hover:underline"
                    >
                        {comment.author.name}
                    </Link>
                    <span className="text-muted-foreground">
                        {formatDate(new Date(comment.createdAt).getTime())}
                    </span>
                </div>
                <div>{comment.content}</div>
            </div>
            {
                comment.author.id === session.user.id && (
                    <div className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
                    >
                        <CommentMoreButton id={comment.id} />
                    </div>
                )
            }
        </div >
    )
}
