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
        mutationFn: async ({ isFollowing }: { isFollowing: boolean }) => {
            if (isFollowing) {

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
        onMutate: async ({ isFollowing }) => {
            const queryKey: QueryKey = ["follower-info", userId]
            await queryClient.cancelQueries({ queryKey })
            const prevState = queryClient.getQueryData<FollowerInfo>(queryKey)
            if (!prevState) return { prevState }
            queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
                followers: isFollowing ? prevState.followers - 1 : prevState.followers + 1,
                isFollowedByUser: !prevState.isFollowedByUser
            }))
            return { prevState }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["follower-info", userId],
            });
        },
        onError(error, variables, context) {
            const queryKey: QueryKey = ["follower-info", userId]
            queryClient.setQueryData(queryKey, context?.prevState)
        },
    })
    return (
        <Button
            disabled={isPending}
            onClick={() => mutate({ isFollowing: data.isFollowedByUser })}
            variant={data.isFollowedByUser ? "secondary" : "default"}
        >
            {data.isFollowedByUser ? "Unfollow" : "Follow"}
        </Button>
    )
}
