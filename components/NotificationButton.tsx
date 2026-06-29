"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { NotificationCountInfo } from "@/lib/types";

export default function NotificationButton({ initialData }: { initialData: NotificationCountInfo }) {

    const { data } = useQuery({
        queryKey: ["unread-notifications-count"],
        queryFn: async () => {
            const res = await fetch(`/api/notifications/unread-noti`)
            if (!res.ok) {
                throw new Error("failed to fetch posts");
            }
            const data: NotificationCountInfo = await res.json()
            return data
        },
        initialData: initialData,
        refetchInterval: 60 * 1000,
    })

    return (
        <Button
            asChild
            variant="ghost"
            className={`
                sm:hover:bg-muted
                flex-1 min-w-0
                w-full sm:w-full
                justify-center sm:justify-start
                h-12
                sm:py-3
                px-2 sm:px-4
                text-[18px] font-medium
                rounded-full
                gap-0 sm:gap-4
                hover:bg-muted
                transition
            `}
        >
            <Link
                href={
                    "/notifications"
                }
                className="flex items-center justify-center sm:justify-start gap-0 sm:gap-4 w-full"
            >
                <span className="relative size-5 flex items-center justify-center">
                    <Bell />

                    {!!data.unreadCount && (
                        <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
                            {data.unreadCount}
                        </span>
                    )}
                </span>

                <span className="hidden sm:block tracking-tight">
                    Notification
                </span>
            </Link>
        </Button>
    );
}