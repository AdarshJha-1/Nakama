"use client";

import Link from "next/link";
import { Heart, MessageCircle, User2 } from "lucide-react";

import { NotificationDTO } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface NotificationProps {
    notification: NotificationDTO;
}

export default function Notification({
    notification,
}: NotificationProps) {


    const notificationTypeMap: Record<string, {
        message: string,
        icon: React.JSX.Element,
        href: string,
    }> = {
        FOLLOW: {
            message: `${notification.withData.issuer.name} followed you`,
            icon: <User2 className="size-5 text-primary" />,
            href: `/users/${notification.withData.issuer.username}`,
        },

        COMMENT: {
            message: `${notification.withData.issuer.name} commented on your post`,
            icon: (
                <MessageCircle className="size-5 fill-primary text-primary" />
            ),
            href: `/posts/${notification.postId}`,
        },

        LIKE: {
            message: `${notification.withData.issuer.name} liked your post`,
            icon: (
                <Heart className="size-5 fill-red-500 text-red-500" />
            ),
            href: `/posts/${notification.postId}`,
        },
    };

    const { message, icon, href } =
        notificationTypeMap[notification.type];

    return (
        <Link href={href} className="block">
            <article
                className={cn(
                    "flex gap-3 sm:rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-card/70",
                    !notification.read && "bg-primary/10"
                )}
            >
                <div className="my-1 shrink-0">
                    {icon}
                </div>

                <div className="space-y-3 min-w-0">

                    <Image
                        src={notification.withData.issuer.image as string}
                        width={36}
                        height={36}
                        alt="profile"
                        className="rounded-full"
                    />

                    <div className="wrap-break-words">
                        <span className="font-bold">
                            {notification.withData.issuer.name}
                        </span>{" "}
                        <span>{message}</span>
                    </div>

                    {notification.withData.post && (
                        <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
                            {notification.withData.post.content}
                        </div>
                    )}
                </div>
            </article>
        </Link>
    );
}