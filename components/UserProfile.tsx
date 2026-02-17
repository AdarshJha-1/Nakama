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
import { UserType } from "@/lib/types";


interface UserProfileProps {
    user: UserType;
}

export default function UserProfile({ user }: UserProfileProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
                {user?.image && <Image className="rounded-full" src={user.image as string} width={50} height={50} alt="avatar" />
                }
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
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