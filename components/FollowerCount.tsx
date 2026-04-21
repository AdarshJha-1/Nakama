"use client"

import useFollowersInfo from "@/hooks/useFollowersInfo";
import { FollowerInfo } from "@/lib/types";

interface ShowFollowerCountProps {
    userId: string;
    initialState: FollowerInfo
}

export default function ShowFollowerCount({ initialState, userId }: ShowFollowerCountProps) {
    const { data } = useFollowersInfo(userId, initialState)
    return (
        <span>Followers: {data.followers}</span>
    )
}