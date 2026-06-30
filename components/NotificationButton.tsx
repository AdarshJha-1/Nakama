"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { NotificationCountInfo } from "@/lib/types";

export default function NotificationButton({
    initialData,
}: {
    initialData: NotificationCountInfo;
}) {
    const { data } = useQuery({
        queryKey: ["unread-notifications-count"],
        queryFn: async () => {
            const res = await fetch("/api/notifications/unread-noti");

            if (!res.ok) {
                throw new Error("Failed to fetch notifications");
            }

            return res.json() as Promise<NotificationCountInfo>;
        },
        initialData,
        refetchInterval: 60 * 1000,
    });

    return (
        <Button
            asChild
            variant="ghost"
            className="
                flex-1
                min-w-0
                w-full
                h-12
                px-2
                lg:px-4
                justify-center
                lg:justify-start
                gap-0
                lg:gap-4
                rounded-full
                text-[18px]
                font-medium
                transition
                hover:bg-muted
            "
        >
            <Link
                href="/notifications"
                className="
                    flex
                    w-full
                    items-center
                    justify-center
                    lg:justify-start

                    gap-0
                    lg:gap-4
                "
            >
                <span className="relative flex size-5 items-center justify-center">
                    <Bell />

                    {!!data.unreadCount && (
                        <span
                            className="
                                absolute
                                -right-2
                                -top-2
                                min-w-5
                                rounded-full
                                bg-primary
                                px-1
                                text-center
                                text-[10px]
                                font-semibold
                                leading-5
                                text-primary-foreground
                            "
                        >
                            {data.unreadCount > 99
                                ? "99+"
                                : data.unreadCount}
                        </span>
                    )}
                </span>

                <span className="hidden lg:block tracking-tight">
                    Notifications
                </span>
            </Link>
        </Button>
    );
}