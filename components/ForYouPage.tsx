"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react";
import PostCard from "./posts/PostCard";
import InfiniteLoading from "./InfiniteLoading";
import PostCardSkeleton from "./posts/PostCardSkeleton";
import { PostDTO, PostPage } from "@/lib/types";

export default function ForYouPage() {

    const { data, fetchNextPage, hasNextPage, isFetching, status, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["post-feed", "for-you"],
        queryFn: async ({ pageParam }) => {
            const searchParam = new URLSearchParams()
            if (pageParam) searchParam.append("cursor", encodeURIComponent(pageParam))
            const res = await fetch(`/api/posts/for-you?${searchParam}`)
            if (!res.ok) {
                throw new Error("failed to fetch posts");
            }
            const data: PostPage = await res.json();
            return data;
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const posts = data?.pages.flatMap(page => page.posts) || []

    if (status === "pending") {
        return (
            <div className="flex flex-col gap-5">
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
            </div>
        )
    }

    if (status === "success" && !hasNextPage && !posts.length) {
        return <p className="text-center my-5 text-muted-foreground">No posts yet.</p>
    }

    if (status === "error") {
        return <div className="text-center text-destructive">An error occurred during loading the posts</div>
    }

    return (
        <InfiniteLoading className="flex flex-col space-y-2 sm:space-y-3" onBottomReached={() => {
            hasNextPage && !isFetching && fetchNextPage()
        }}>
            {
                posts.map((post: PostDTO, i: number) => (
                    <PostCard key={post.id} post={post} />
                ))
            }
            {
                isFetchingNextPage && <Loader2 className="mx-auto animate-spin my-3" />
            }
        </InfiniteLoading>
    )
}