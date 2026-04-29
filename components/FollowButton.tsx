"use client"
import useFollowersInfo from '@/hooks/useFollowersInfo'
import { FollowerInfo } from '@/lib/types'
import { Button } from './ui/button'
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'

interface FollowButtonProps {
    userId: string,
    initialState: FollowerInfo
}

export default function FollowButton({ userId, initialState }: FollowButtonProps) {

    const { data } = useFollowersInfo(userId, initialState)

    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            if (data.isFollowedByUser) {
                const res = await fetch(`/api/users/${userId}/followers`, {
                    method: "DELETE"
                })
                if (!res.ok) throw new Error("Failed")
                return res.json()
            } else {

                const res = await fetch(`/api/users/${userId}/followers`, {
                    method: "POST"
                })
                if (!res.ok) throw new Error("Failed")
                return res.json()
            }
        },
        onMutate: async () => {
            const queryKey: QueryKey = ["follower-info", userId]
            await queryClient.cancelQueries({ queryKey })
            const prevState = queryClient.getQueryData<FollowerInfo>(queryKey)
            if (!prevState) return { prevState }
            queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
                followers: (prevState.followers || 0) + (prevState?.isFollowedByUser ? -1 : 1),
                isFollowedByUser: !prevState.isFollowedByUser
            }))
            return { prevState }
        },
        onError(error, variables, context) {
            const queryKey: QueryKey = ["follower-info", userId]
            queryClient.setQueryData(queryKey, context?.prevState)
        },
    })
    return (
        <Button
            disabled={isPending}
            onClick={() => mutate()}
            variant={data.isFollowedByUser ? "secondary" : "default"}
        >
            {data.isFollowedByUser ? "Unfollow" : "Follow"}
        </Button>
    )
}
