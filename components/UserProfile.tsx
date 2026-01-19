import { User } from "@/lib/auth"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { Settings, UserIcon, } from "lucide-react";
import SignOutButton from "./SignOutButton";


interface UserProfileProps {
    user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
                {user?.image && <Image className="rounded-full" src={user.image as string} width={60} height={60} alt="avatar" />
                }
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem className="flex items-center justify-between">
                        Profile
                        <UserIcon />
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Settings
                        <DropdownMenuShortcut><Settings /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <SignOutButton />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

//src={"https://i.pinimg.com/736x/3e/cd/d0/3ecdd093c3aba2cf817c65d83bdb45cb.jpg"} 
