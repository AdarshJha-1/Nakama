import { BookmarkInfo } from '@/lib/types';
import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
    postId: string;
    initialState: BookmarkInfo;
}

export default function BookmarkButton({ postId, initialState }: BookmarkButtonProps) {

    const { data } = useQuery({
        queryKey: ["bookmark-info", postId],
        queryFn: async () => {
            const res = await fetch(`/api/posts/${postId}/bookmark`)
            if (!res.ok) {
                throw new Error("failed to fetch bookmark info");
            }
            const { data }: { data: BookmarkInfo } = await res.json(); return data;
        },
        initialData: initialState,
        staleTime: Infinity,
    })

    const queryKey: QueryKey = ["bookmark-info", postId]
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: async () => {
            if (data.isBookmarkedByUser) {
                const res = await fetch(`/api/posts/${postId}/bookmark`, {
                    method: "DELETE"
                })
                if (!res.ok) throw new Error("Failed")
                return res.json()
            } else {
                const res = await fetch(`/api/posts/${postId}/bookmark`, {
                    method: "POST"
                })
                if (!res.ok) throw new Error("Failed")
                return res.json()
            }
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey })
            const prevState = queryClient.getQueryData<BookmarkInfo>(queryKey)
            if (!prevState) return { prevState }

            queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
                bookmarks: (prevState?.bookmarks || 0) + (prevState?.isBookmarkedByUser ? -1 : +1),
                isBookmarkedByUser: !prevState.isBookmarkedByUser,
            }))
            return { prevState }
        },
        onError(error, variables, context) {
            queryClient.setQueryData(queryKey, context?.prevState)
        },
    })

    return (
        <button
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation();
                mutate();
            }}
            className={cn(
                "group flex items-center gap-1 cursor-pointer text-sm transition-colors duration-200",
                data.isBookmarkedByUser
                    ? "text-blue-500"
                    : "text-muted-foreground"
            )}
        >
            <span className="relative flex items-center justify-center">
                <span className="absolute size-8 rounded-full scale-0 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 bg-blue-500/10" />
                <Bookmark
                    className={cn(
                        "relative z-10 size-4 transition-colors duration-200",
                        data.isBookmarkedByUser
                            ? "fill-blue-500 text-blue-500"
                            : "group-hover:text-blue-500"
                    )}
                />
            </span>
            <span
                className={cn(
                    "font-medium transition-colors duration-200",
                    data.isBookmarkedByUser
                        ? "text-blue-500"
                        : "group-hover:text-blue-500"
                )}
            >
                {data.bookmarks}
            </span>
        </button>
    )
}
