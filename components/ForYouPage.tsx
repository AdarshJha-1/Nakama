"use client"

import { useQuery } from "@tanstack/react-query"
import { LoaderIcon } from "lucide-react";
import PostCard from "./posts/PostCard";
import { PostWithUser } from "@/types/Post";

export default function ForYouPage() {

    const query = useQuery({
        queryKey: ["post-feed", "for-you"],
        queryFn: async () => {
            const res = await fetch("/api/posts/for-you")
            if (!res.ok) {
                throw new Error("failed to fetch posts");

            }

            return res.json();
        }
    })

    if (query.status === "pending") {
        return <LoaderIcon className="mx-auto animate-spin" />
    }

    if (query.status === "error") {
        return <div className="text-center text-destructive">An error occurred during loading the posts</div>
    }

    return (
        <div className="flex flex-col gap-5">
            {
                query.data.map((post: PostWithUser, i: number) => (
                    <PostCard key={i} post={post} />
                ))
            }
        </div>
    )

}