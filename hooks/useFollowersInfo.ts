import { FollowerInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowersInfo(userId: string, initialState: FollowerInfo) {
    const query = useQuery({
        queryKey: ["follower-info", userId],
        queryFn: async () => {
            const res = await fetch(`/api/users/${userId}/followers`)
            if (!res.ok) {
                throw new Error("failed to fetch posts");
            }
            const { data }: { data: FollowerInfo } = await res.json();
            return data;
        },
        initialData: initialState,
        staleTime: Infinity
    })

    return query;
}