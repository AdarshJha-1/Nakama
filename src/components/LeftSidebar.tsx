import { Bell, BookMarked, Home, Search } from "lucide-react";
import SidebarButton from "./SidebarButton";

export default function LeftSidebar({ className }: { className: string }) {
    return (
        <div className={`${className}`}>
            <SidebarButton linkName="/" buttonName="Home" icon={Home} />
            <SidebarButton linkName="/search" buttonName="Search" icon={Search} />
            <SidebarButton linkName="/notification" buttonName="Notifications" icon={Bell} />
            <SidebarButton linkName="/bookmark" buttonName="Bookmarks" icon={BookMarked} />
        </div>
    )
}