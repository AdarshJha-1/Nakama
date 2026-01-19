import Link from "next/link";
import { Button } from "./ui/button";
import { Bell, Book, Home, Search } from "lucide-react";
import { ReactNode } from "react";

export default function LeftSidebar() {
    return (
        <header className="flex flex-col gap-2 border shadow min-w-56 justify-center px-3 h-52 rounded-2xl">
            <SidebarButton buttonName="Home" buttonIcon={<Home />} buttonPath="home" />
            <SidebarButton buttonName="Search" buttonIcon={<Search />} buttonPath="search" />
            <SidebarButton buttonName="Notification" buttonIcon={<Bell />} buttonPath="notification" />
            <SidebarButton buttonName="Bookmarks" buttonIcon={<Book />} buttonPath="bookmark" />
        </header>
    )
}

interface SidebarButtonProps {
    buttonPath?: string;
    buttonName: string;
    className?: string;
    buttonIcon?: ReactNode;
}

function SidebarButton({ buttonPath, buttonName, buttonIcon, className = "" }: SidebarButtonProps) {
    return <Button className={`h-10 ${className}`} asChild>
        <Link href={buttonPath?.startsWith("/") ? buttonPath : `/${buttonPath}`}>
            {buttonIcon}
            <span>{buttonName}</span>
        </Link>
    </Button>
}