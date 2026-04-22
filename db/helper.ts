import { sql } from "drizzle-orm";
import { follow, post, user } from "./schema";

export function userOfPost(loggedInUserId: string) {
    return {
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
        createdAt: user.createdAt,

        isFollowing: sql<boolean>`
                EXISTS (
                SELECT 1 
                FROM ${follow}
                WHERE ${follow.followerId} = ${loggedInUserId}
                AND ${follow.followingId} = ${user.id})`,
        followerCount: sql<number>`(
                SELECT COUNT(*)::int
                FROM ${follow}
                WHERE ${follow.followingId} = ${user.id}
            )`,
        postsCount: sql<number>`(
                SELECT COUNT(*)::int
                FROM ${post}
                WHERE ${post.userId} = ${user.id}
            )`,
    }
}