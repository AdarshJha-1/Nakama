"use client"

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react";
import { NotificationDTO, NotificationPage } from "@/lib/types";
import InfiniteLoading from "@/components/InfiniteLoading";
import PostCardSkeleton from "@/components/posts/PostCardSkeleton";
import Notification from "./Notification";
import { useEffect } from "react";

export default function Notifications() {

    const { data, fetchNextPage, hasNextPage, isFetching, status, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["notification"],
        queryFn: async ({ pageParam }) => {
            const searchParam = new URLSearchParams()
            if (pageParam) searchParam.append("cursor", encodeURIComponent(pageParam))
            const res = await fetch(`/api/notifications/?${searchParam}`)
            if (!res.ok) {
                throw new Error("failed to fetch posts");
            }
            const data: NotificationPage = await res.json()
            return data
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: async () => await fetch(`/api/notifications/mark-read`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        }),
        onSuccess: () => {
            queryClient.setQueryData(["unread-notifications-count"], {
                unreadCount: 0
            })
        },
        onError(error) {
            console.error("Failed to mark notifications as read", error);
        },
    })
    useEffect(() => {
        mutate();
    }, [mutate]);


    const notifications = data?.pages.flatMap(page => page.notifications) || []

    if (status === "pending") {
        return (
            <div className="flex flex-col gap-5">
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
            </div>
        )
    }

    if (status === "success" && !hasNextPage && !notifications.length) {
        return <p className="text-center my-5 text-muted-foreground">No bookmarked posts yet.</p>
    }

    if (status === "error") {
        return <div className="text-center text-destructive">An error occurred during loading the posts</div>
    }

    return (
        <InfiniteLoading className="flex flex-col gap-2 sm:gap-5" onBottomReached={() => {
            hasNextPage && !isFetching && fetchNextPage()
        }}>
            {
                notifications.map((notification: NotificationDTO) => (
                    <Notification key={notification.id} notification={notification} />
                ))
            }
            {
                isFetchingNextPage && <Loader2 className="mx-auto animate-spin my-3" />
            }
        </InfiniteLoading>
    )
}