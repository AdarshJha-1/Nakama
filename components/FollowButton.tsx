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

    console.log(typeof data.followers);

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: () => data.isFollowedByUser ?
            fetch(`/api/users/${userId}/followers`, {
                method: "DELETE"
            }) :
            fetch(`/api/users/${userId}/followers`, {
                method: "POST"
            }),
        onSuccess: async (res) => {
            const queryKey: QueryKey = ["follower-info", userId]
            await queryClient.cancelQueries({ queryKey })

            const prevState = queryClient.getQueryData<FollowerInfo>(queryKey)

            console.log("from::", prevState?.followers);
            console.log("to::", (prevState?.followers || 0) + (prevState?.isFollowedByUser ? -1 : 1));


            queryClient.setQueryData<FollowerInfo>(queryKey, () => (
                {
                    followers: (prevState?.followers || 0) + (prevState?.isFollowedByUser ? -1 : 1),
                    isFollowedByUser: !prevState?.isFollowedByUser
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
            onClick={() => mutate()}
            variant={data.isFollowedByUser ? "secondary" : "default"}
        >
            {data.isFollowedByUser ? "Unfollow" : "Follow"}
        </Button>
    )
}
