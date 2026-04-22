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
import { Edit, MoreVertical, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { useDeletePostMutation } from "./posts/mutation";

export default function PostMore({ id }: { id: string }) {
    const mutation = useDeletePostMutation();
    const handleDeletePost = () => {
        mutation.mutate(id)
    }
    return (
        <div className="flex gap-1">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MoreVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="flex flex-col gap-1">
                    <DropdownMenuItem asChild>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="w-full" variant={"ghost"}><Trash /> Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your post
                                        from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    {/* This button does not close after deletion is done have to fix it, maybe will use another shadcn component */}
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeletePost} variant={"destructive"}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Button className="w-full" variant={"ghost"}><Edit /> Edit</Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )

}
