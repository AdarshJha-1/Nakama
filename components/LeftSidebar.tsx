import Link from "next/link";
import { Button } from "./ui/button";
import { Book, Home, SearchIcon } from "lucide-react";
import { ReactNode } from "react";
import NotificationButton from "./NotificationButton";
import { db } from "@/db/drizzle";
import { notification } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "@/lib/getServerSession";
import { NotificationCountInfo } from "@/lib/types";
import { redirect } from "next/navigation";

export default async function LeftSidebar({ className }: { className?: string }) {

    const session = await getServerSession();
    if (!session) {
        return redirect("/auth")
    }

    const unreadNotiCount = await db.$count(
        notification,
        and(
            eq(notification.recipientId, session.user.id),
            eq(notification.read, false)
        )
    )
    const unreadNotificationsCount: NotificationCountInfo = {
        unreadCount: unreadNotiCount
    }

    return (
        <header
            className={`
            flex flex-row
            sm:flex-col
            items-center
            sm:items-stretch
            justify-between

            w-full
            sm:w-18
            lg:w-56

            px-2 py-2

            bg-card
            rounded-none
            sm:rounded-4xl

            ${className}
        `}
        >
            <SidebarButton buttonName="Home" buttonIcon={<Home />} buttonPath="/" />
            <SidebarButton buttonName="Search" buttonIcon={<SearchIcon />} buttonPath="/search" />
            <NotificationButton initialData={unreadNotificationsCount} />
            <SidebarButton buttonName="Bookmarks" buttonIcon={<Book />} buttonPath="bookmarks" />
        </header>
    );
}

interface SidebarButtonProps {
    buttonPath?: string;
    buttonName: string;
    className?: string;
    buttonIcon?: ReactNode;
}

function SidebarButton({
    buttonPath,
    buttonName,
    buttonIcon,
    className = "",
}: SidebarButtonProps) {
    return (
        <Button
            asChild
            variant="ghost"
            className={`
                sm:hover:bg-muted
                flex-1 min-w-0
                w-full sm:w-full
                justify-center lg:justify-start
                h-12
                sm:py-3
                px-2 lg:px-4
                text-[18px] font-medium
                rounded-full
                gap-0 lg:gap-4
                hover:bg-muted
                transition
                ${className}
            `}
        >
            <Link
                href={
                    buttonPath?.startsWith("/")
                        ? buttonPath
                        : `/${buttonPath}`
                }
                className="flex w-full items-center justify-center lg:justify-start gap-0 lg:gap-4"
            >
                <span className="size-5 flex items-center justify-center">
                    {buttonIcon}
                </span>

                <span className="hidden lg:block tracking-tight">
                    {buttonName}
                </span>
            </Link>
        </Button>
    );
}