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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Copy, MessageCircle, MoreVertical, PencilIcon, Share2, TrashIcon, X } from "lucide-react";
import { useDeletePostMutation } from "./mutation";
import { DropdownMenuGroup, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";

export default function PostMore({ id }: { id: string }) {

    const [open, setOpen] = useState(false)

    const mutation = useDeletePostMutation();
    const handleDeletePost = () => {
        mutation.mutate(id)
    }

    const getPostUrl = () => `${window.location.origin}/posts/${id}`;

    const handleCopyToClipboard = async () => {
        await navigator.clipboard.writeText(getPostUrl())
        toast.success("Copied!")
        setOpen(false)
    }
    const shareNative = async () => {
        if (!navigator.share) {
            toast.error("Sharing isn't supported on this browser.");
            return;
        }

        try {
            await navigator.share({
                title: "Check this out!",
                url: getPostUrl(),
            });
        } catch {
        }
    };
    const shareOnX = () => {
        const tweet = new URL("https://twitter.com/intent/tweet");

        tweet.searchParams.set("url", getPostUrl());
        tweet.searchParams.set("text", "Check out this post!");

        window.open(tweet.toString(), "_blank");
        setOpen(false)
    }

    const shareOnWhatsapp = () => {
        const whatsapp = new URL("https://wa.me/");

        whatsapp.searchParams.set(
            "text",
            `Check out this post!\n${getPostUrl()}`,
        );

        window.open(whatsapp.toString(), "_blank");
        setOpen(false)
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild className="cursor-pointer">
                <button type="button">
                    <MoreVertical className="size-5" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent >
                <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}
                    >
                        <PencilIcon />
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Share2 className="size-4" />
                            Share
                        </DropdownMenuSubTrigger>

                        <DropdownMenuSubContent className="w-52">
                            <DropdownMenuItem onClick={handleCopyToClipboard}>
                                <Copy className="size-4" />
                                Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={shareNative}>
                                <Share2 className="size-4" />
                                share...
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={shareOnX}>
                                <X className="size-4" />
                                X
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={shareOnWhatsapp}>
                                <MessageCircle className="size-4" />
                                WhatsApp
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
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

                        <AlertDialogContent >
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
                                        setOpen(false)
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
        </DropdownMenu >
    )
}