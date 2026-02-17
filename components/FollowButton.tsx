import useFollowersInfo from '@/hooks/useFollowersInfo'
import { FollowerInfo } from '@/lib/types'
import React from 'react'
import { Button } from './ui/button'
import { useMutation } from '@tanstack/react-query'

interface FollowButtonProps {
    userId: string,
    initialState: FollowerInfo
}

export default function FollowButton({ userId, initialState }: FollowButtonProps) {

    const { data } = useFollowersInfo(userId, initialState)

    const { mutate } = useMutation({
        mutationFn: () => data.isFollowedByUser ? fetch(`api/users/${userId}/followers`, {
            method: "DELETE"
        }) :
            fetch(`api/users/${userId}/followers`, {
                method: "POST"
            })
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
