import Link from "next/link";

import {
    LogOut,
    UserIcon,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

interface UserProfileProps {
    user: {
        image?: string | null | undefined;
        name: string,
        username: string
    }
}
// TODO fix this make it for all the things
export default function UserProfile({ user }: UserProfileProps) {
    const client = useQueryClient()
    const router = useRouter()
    const handleSignOut = async () => {
        client.clear()
        await signOut();
        router.push("/auth")
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-10 w-10">
                        {user.image && <AvatarImage src={user.image} alt="profile-image" />}
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="font-medium">
                <Link href={`/users/${user.username}`}>
                    <DropdownMenuItem className="h-10">
                        <UserIcon />
                        <p>{user.name}</p>
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={handleSignOut} className="h-10">
                    <LogOut />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
