"use client"

import { CommentsPage, PostDTO } from "@/lib/types";
import CommentInput from "./CommentInput";
import { useInfiniteQuery } from "@tanstack/react-query";
import Comment from "./Comment";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface CommentsProps {
    post: PostDTO
}

export default function Comments({ post }: CommentsProps) {

    const { data, fetchNextPage, hasNextPage, isFetching, status } = useInfiniteQuery({
        queryKey: ["comments", post.id],
        queryFn: async ({ pageParam }) => {
            const searchParam = new URLSearchParams()
            if (pageParam) searchParam.append("cursor", pageParam)
            const res = await fetch(`/api/posts/${post.id}/comments?${searchParam}`)
            if (!res.ok) {
                throw new Error("failed to fetch posts");
            }
            const data: CommentsPage = await res.json();
            return data;
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const comments = data?.pages.flatMap(page => page.comments) || []

    return (
        <div className="space-y-2">
            <CommentInput post={post} />
            {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
            {status === "success" && !comments.length && (
                <p className="text-center text-muted-foreground">No comments yet.</p>
            )}
            {status === "error" && (
                <p className="text-center text-destructive">
                    An error occurred while loading comments.
                </p>
            )}
            <div className="divide-y">
                {
                    comments.map(comment => (
                        <Comment comment={comment} key={comment.id} />
                    ))
                }
            </div>

            {hasNextPage && !isFetching &&
                <Button
                    variant={"link"}
                    className="text-sm mx-auto block"
                    disabled={isFetching}
                    onClick={() => {
                        fetchNextPage()
                    }
                    }>
                    load more comments
                </Button>
            }
        </div>
    )
}
