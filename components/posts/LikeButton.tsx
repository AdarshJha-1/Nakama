import { LikeInfo } from '@/lib/types';
import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostLikesProps {
    postId: string;
    initialState: LikeInfo;
}

export default function LikeButton({ postId, initialState }: PostLikesProps) {

    const { data } = useQuery({
        queryKey: ["like-info", postId],
        queryFn: async () => {
            const res = await fetch(`/api/posts/${postId}/likes`)
            if (!res.ok) {
                throw new Error("failed to fetch likes info");
            }
            const { data }: { data: LikeInfo } = await res.json();
            return data;
        },
        initialData: initialState,
        staleTime: Infinity,
    })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: async () => {
            if (data.isLikedByUser) {
                const res = await fetch(`/api/posts/${postId}/likes`, {
                    method: "DELETE"
                })
                if (!res.ok) throw new Error("Failed")
                return res.json()
            } else {
                const res = await fetch(`/api/posts/${postId}/likes`, {
                    method: "POST"
                })
                if (!res.ok) throw new Error("Failed")
                return res.json()
            }
        },
        onMutate: async () => {
            const queryKey: QueryKey = ["like-info", postId]
            await queryClient.cancelQueries({ queryKey })
            const prevState = queryClient.getQueryData<LikeInfo>(queryKey)
            if (!prevState) return { prevState }

            queryClient.setQueryData<LikeInfo>(queryKey, () => ({
                likes: (prevState?.likes || 0) + (prevState?.isLikedByUser ? -1 : +1),
                isLikedByUser: !prevState.isLikedByUser,
            }))
            return { prevState }
        },
        onError(error, variables, context) {
            const queryKey: QueryKey = ["like-info", postId]
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
                "group flex items-center gap-1 transition-colors duration-200 cursor-pointer",
                data.isLikedByUser
                    ? "text-pink-500"
                    : "text-muted-foreground"
            )}
        >
            <span className="relative flex items-center justify-center">
                <span className="absolute size-8 rounded-full scale-0 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 bg-pink-500/10" />
                <Heart
                    className={cn(
                        "relative z-10 transition-colors duration-200",
                        data.isLikedByUser
                            ? "fill-pink-500 text-pink-500"
                            : "group-hover:text-pink-500"
                    )}
                />
            </span>
            <span
                className={cn(
                    "transition-colors duration-200",
                    data.isLikedByUser
                        ? "text-pink-500"
                        : "group-hover:text-pink-500"
                )}
            >
                {data.likes}
            </span>
        </button>
    )
}