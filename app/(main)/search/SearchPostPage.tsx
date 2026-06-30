"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";

import InfiniteLoading from "@/components/InfiniteLoading";
import { SearchPost, SearchPostsPage } from "@/lib/types";
import PostCardSkeleton from "@/components/posts/PostCardSkeleton";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/date-format";

type Props = {
    query: string;
};

export default function SearchedPostPage({ query }: Props) {

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isPending,
        status,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["search-posts", query],
        queryFn: async ({ pageParam }) => {
            const params = new URLSearchParams();

            params.set("q", query);

            if (pageParam) {
                params.set("cursor", pageParam);
            }

            const res = await fetch(`/api/search/posts?${params}`);

            if (!res.ok) {
                throw new Error("Failed to search users");
            }

            return res.json() as Promise<SearchPostsPage>;
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: query.trim().length > 0,
    });

    const posts =
        data?.pages.flatMap((page) => page.posts) ?? [];

    if (query.trim() && isPending) {
        return (
            <div className="space-y-4">
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
            </div>
        );
    }

    if (status === "error") {
        return (
            <p className="py-8 text-center text-destructive">
                Something went wrong.
            </p>
        );
    }

    if (!posts.length) {
        return (
            <section className="rounded-2xl border bg-card">
                <p className="p-8 text-center text-muted-foreground">
                    No post found.
                </p>
            </section>
        );
    }

    return (
        <section className="flex min-w-0 flex-col sm:rounded-xl">

            <InfiniteLoading
                className="flex flex-col gap-3"
                onBottomReached={() => {
                    if (hasNextPage && !isFetching) {
                        fetchNextPage();
                    }
                }}
            >
                {posts.map((post) => (
                    <SearchPostCard
                        key={post.id}
                        post={post}
                    />
                ))}

                {isFetchingNextPage && (
                    <Loader2 className="mx-auto my-5 animate-spin" />
                )}
            </InfiniteLoading>
        </section>
    );
}
type CardProps = {
    post: SearchPost;
};
function SearchPostCard({ post }: CardProps) {
    const router = useRouter();

    const formattedDate = formatDate(
        new Date(post.createdAt).getTime()
    );

    return (
        <div
            onClick={() => router.push(`/posts/${post.id}`)}
            className="
                cursor-pointer
                bg-card
                p-5
                shadow-sm
                transition
                hover:shadow-md
                sm:rounded-2xl
            "
        >
            <div className="flex items-start gap-3">
                <Link
                    href={`/users/${post.author.username}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Image
                        src={
                            post.author.image ??
                            "/avatar-placeholder.png"
                        }
                        alt={post.author.name}
                        width={44}
                        height={44}
                        className="size-11 rounded-full object-cover"
                    />
                </Link>

                <div className="min-w-0 flex-1">
                    <Link
                        href={`/users/${post.author.username}`}
                        onClick={(e) => e.stopPropagation()}
                        className="block truncate font-semibold hover:underline"
                    >
                        {post.author.name}
                    </Link>

                    <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                        <span className="truncate">
                            @{post.author.username}
                        </span>

                        <span>•</span>

                        <span>{formattedDate}</span>
                    </div>
                </div>
            </div>

            {post.content && (
                <p className="mt-4 whitespace-pre-wrap break-words text-[17px] leading-relaxed">
                    {post.content}
                </p>
            )}

            {post.media && (
                <div className="mt-4">
                    <Image
                        src={post.media.url as string}
                        alt="Post image"
                        width={900}
                        height={600}
                        className="
                            max-h-[420px]
                            w-full
                            rounded-2xl
                            object-cover
                        "
                    />
                </div>
            )}
        </div>
    );
}