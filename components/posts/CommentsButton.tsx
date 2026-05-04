import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentButtonProps {
    count: number;
    setShowComments: () => void;
}

export default function CommentButton({ count, setShowComments }: CommentButtonProps) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation()
                setShowComments();
            }}
            className={cn(
                "group flex items-center gap-1 transition-colors duration-200 cursor-pointer",
                "text-muted-foreground hover:text-sky-500"
            )}
        >
            <span className="relative flex items-center justify-center">
                <span className="absolute size-8 rounded-full scale-0 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 bg-sky-500/10" />
                <MessageCircle
                    className={cn(
                        "relative z-10 transition-colors duration-200",
                        "group-hover:text-sky-500"
                    )}
                />
            </span>
            <span className="transition-colors duration-200 group-hover:text-sky-500">
                {count}
            </span>
        </button>
    );
}