"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, PencilIcon, ShareIcon, TrashIcon } from "lucide-react";
import { useDeletePostMutation } from "./mutation";
import { DropdownMenuGroup, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

export default function PostMore({ id }: { id: string }) {

    const [open, setOpen] = useState(false)

    const mutation = useDeletePostMutation();
    const handleDeletePost = () => {
        mutation.mutate(id)
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <div onClick={(e) => e.stopPropagation()}>
                <DropdownMenuTrigger asChild>
                    <button type="button">
                        <MoreVertical className="size-5" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <PencilIcon />
                            Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <ShareIcon />
                            Share
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    variant="destructive"
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    <TrashIcon />
                                    Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>

                            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setOpen(false)}>
                                        Cancel
                                    </AlertDialogCancel>

                                    <AlertDialogAction
                                        onClick={() => {
                                            handleDeletePost();
                                            setOpen(false);
                                        }}
                                        variant="destructive"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </div>
        </DropdownMenu>
    )
}