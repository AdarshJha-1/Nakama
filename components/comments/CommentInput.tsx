import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, SendHorizonal } from "lucide-react";
import { useSubmitCommentMutation } from "./mutation";
import { PostDTO } from "@/lib/types";

interface CommentInputProps {
    post: PostDTO
}

export default function CommentInput({ post }: CommentInputProps) {
    const [inputData, setInputData] = useState("");

    const mutation = useSubmitCommentMutation(post.id)

    function onSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!inputData) return;

        mutation.mutate({
            content: inputData,
            post
        }, {
            onSuccess: () => setInputData("")
        })

    }

    return (
        <form className="flex w-full items-center gap-2" onSubmit={onSubmit}>
            <Input
                value={inputData}
                placeholder="Write a comment..."
                onChange={(e) => setInputData(e.target.value)}
                autoFocus
            />
            <Button type="submit" variant={"ghost"} disabled={!inputData.trim() || mutation.isPending}>
                {
                    mutation.isPending ?
                        <Loader2 className="animate-spin" /> :
                        <SendHorizonal />
                }
            </Button>
        </form>
    )
}
