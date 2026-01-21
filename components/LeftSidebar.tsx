import Link from "next/link";
import { Button } from "./ui/button";
import { Bell, Book, Home, Search } from "lucide-react";
import { ReactNode } from "react";

export default function LeftSidebar({ className }: { className?: string }) {
    return (
        <header className={`flex flex-col gap-2 bg-card border shadow w-fit md:w-44 lg:w-52 justify-center items-start px-3 h-52 rounded-2xl transition ease-in ${className}`}>
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
    return <Button className={`w-fit md:w-full h-10 ${className}`} variant={"ghost"} asChild>
        <Link href={buttonPath?.startsWith("/") ? buttonPath : `/${buttonPath}`}>
            {buttonIcon}
            <span className="hidden md:block">{buttonName}</span>
        </Link>
    </Button>
}