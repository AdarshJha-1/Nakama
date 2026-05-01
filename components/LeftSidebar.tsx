import Link from "next/link";
import { Button } from "./ui/button";
import { Bell, Book, Home, Search } from "lucide-react";
import { ReactNode } from "react";

export default function LeftSidebar({ className }: { className?: string }) {
    return (
        <header
            className={`
                flex flex-col gap-1
                w-fit md:w-56
                px-2 py-2
                bg-card
                rounded-4xl
                ${className}
            `}
        >
            <SidebarButton buttonName="Home" buttonIcon={<Home />} buttonPath="/" />
            <SidebarButton buttonName="Search" buttonIcon={<Search />} buttonPath="search" />
            <SidebarButton buttonName="Notifications" buttonIcon={<Bell />} buttonPath="notifications" />
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
                w-full justify-start
                h-12
                px-4
                text-[18px] font-medium
                rounded-full
                gap-4
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
                className="flex items-center gap-4"
            >
                <span className="size-5 flex items-center justify-center">
                    {buttonIcon}
                </span>
                <span className="tracking-tight">
                    {buttonName}
                </span>
            </Link>
        </Button>
    );
}