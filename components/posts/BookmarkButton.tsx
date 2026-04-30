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
        <button onClick={() => mutate()} className="flex items-center gap-2 cursor-pointer ">
            <Bookmark className={cn("size-5 transition-all duration-200 hover:text-blue-400", data.isBookmarkedByUser && "fill-blue-400 text-blue-400")} />
            <span className='text-sm font-medium'>
                {data.bookmarks}
            </span>
        </button>
    )
}
