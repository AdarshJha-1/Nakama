export type PostWithUser = {
    id: string;
    content: string;
    createdAt: Date;
    author: {
        id: string;
        name: string;
        username: string;
        image: string | null;
    };
    likeCount: number;
    bookmarkCount: number;
    commentCount: number;
};

export type UserType = {
    id: string;
    email?: string;
    name: string;
    username: string;
    image?: string | null | undefined;
    role?: string;
    createdAt?: Date;
    updatedAt?: Date;
    followerCount?: number;
    postCount?: number;
}

export interface FollowerInfo {
    followers: number;
    isFollowedByUser: boolean;
}

