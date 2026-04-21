import { PostWithUser } from "@/lib/types"
import UserProfile from "../UserProfile"
import Link from "next/link"
import { formatDate } from "@/lib/date-format";
import { Bookmark, Dot, Edit, Heart, MessageCircleIcon, MoreVertical, Trash } from "lucide-react";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";


import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "../ui/button";
import { useDeletePostMutation } from "./mutation";

export default function PostCard({ post }: { post: PostWithUser }) {

    const date = new Date(post.createdAt)
    const formattedDate = formatDate(date.getTime());

    const mutation = useDeletePostMutation();

    const handleDeletePost = () => {
        mutation.mutate(post.id)
    }

    return (
        <div className="min-h-28 bg-card flex items-start gap-3 rounded-2xl px-5 py-3 text-sm">
            <div className="shrink-0">
                <UserProfile user={post.author} />
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
                            src="https://i.pinimg.com/1200x/3f/7a/04/3f7a0468e08dd5e6dba955a2272c8b73.jpg"
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
                    <div className="flex gap-1">
                        <Heart /> {post.likeCount}
                    </div>
                    <div className="flex gap-1">
                        <Bookmark /> {post.bookmarkCount}
                    </div>
                    <div className="flex gap-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreVertical />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="flex flex-col gap-1">
                                <DropdownMenuItem asChild>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button className="w-full" variant={"ghost"}><Trash /> Delete</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your post
                                                    from our servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                {/* This button does not close after deletion is done have to fix it, maybe will use another shadcn component */}
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDeletePost} variant={"destructive"}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Button className="w-full" variant={"ghost"}><Edit /> Edit</Button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    )
}