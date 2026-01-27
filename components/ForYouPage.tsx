"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react";
import PostCard from "./posts/PostCard";
import { PostWithUser } from "@/types/Post";
import InfiniteLoading from "./InfiniteLoading";
import PostCardSkeleton from "./posts/PostCardSkeleton";

export default function ForYouPage() {

    const { data, fetchNextPage, hasNextPage, isFetching, status, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["post-feed", "for-you"],
        queryFn: async ({ pageParam }) => {
            const searchParam = new URLSearchParams()
            if (pageParam) searchParam.append("cursor", pageParam)
            const res = await fetch(`/api/posts/for-you?${searchParam}`)
            if (!res.ok) {
                throw new Error("failed to fetch posts");
            }
            return res.json();
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const post = data?.pages.flatMap(page => page.posts) || []

    if (status === "pending") {
        return (
            <div className="flex flex-col gap-5">
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
            </div>
        )
    }

    if (status === "success" && !hasNextPage && !post.length) {
        return <p className="text-center my-5 text-muted-foreground">No has posted anything</p>
    }

    if (status === "error") {
        return <div className="text-center text-destructive">An error occurred during loading the posts</div>
    }

    return (
        <InfiniteLoading className="flex flex-col gap-5" onBottomReached={() => {
            hasNextPage && !isFetching && fetchNextPage()
        }}>
            {
                post.map((post: PostWithUser, i: number) => (
                    <PostCard key={i} post={post} />
                ))
            }
            {
                isFetchingNextPage && <Loader2 className="mx-auto animate-spin my-3" />
            }
        </InfiniteLoading>
    )

}