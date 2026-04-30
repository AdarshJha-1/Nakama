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
        <button onClick={(e) => {
            e.stopPropagation()
            mutate()
        }} className="flex items-center justify-center space-x-2 cursor-pointer text-muted-foreground">
            <Heart className={cn("size-5 transition-all duration-200", data.isLikedByUser && "fill-red-500 text-red-500")} /> <span className='text-sm font-medium'>{data.likes} Likes</span>
        </button>
    )
}
