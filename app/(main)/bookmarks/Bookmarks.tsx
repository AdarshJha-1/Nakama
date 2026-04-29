"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react";
import { PostDTO, PostPage } from "@/lib/types";
import InfiniteLoading from "@/components/InfiniteLoading";
import PostCard from "@/components/posts/PostCard";
import PostCardSkeleton from "@/components/posts/PostCardSkeleton";

export default function Bookmarks() {

    const { data, fetchNextPage, hasNextPage, isFetching, status, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["post-feed", "bookmarks"],
        queryFn: async ({ pageParam }) => {
            const searchParam = new URLSearchParams()
            if (pageParam) searchParam.append("cursor", encodeURIComponent(pageParam))
            const res = await fetch(`/api/posts/bookmarked?${searchParam}`)
            if (!res.ok) {
                throw new Error("failed to fetch posts");
            }
            const data: PostPage = await res.json()
            return data
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
        return <p className="text-center my-5 text-muted-foreground">No bookmarked posts yet.</p>
    }

    if (status === "error") {
        return <div className="text-center text-destructive">An error occurred during loading the posts</div>
    }

    return (
        <InfiniteLoading className="flex flex-col gap-5" onBottomReached={() => {
            hasNextPage && !isFetching && fetchNextPage()
        }}>
            {
                posts.map((post: PostDTO) => (
                    <PostCard key={post.id} post={post} />
                ))
            }
            {
                isFetchingNextPage && <Loader2 className="mx-auto animate-spin my-3" />
            }
        </InfiniteLoading>
    )
}