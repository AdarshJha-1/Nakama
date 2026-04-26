export interface FollowerInfo {
    followers: number;
    isFollowedByUser: boolean;
}

export type UserDTO = {
    id: string;
    name: string;
    username: string;
    image: string | null;
    createdAt: Date;

    isFollowed: boolean;
    followerCount: number;
    postCount: number;
};

export type PostDTO = {
    id: string;
    content: string;
    createdAt: Date;

    author: UserDTO;

    isLiked: boolean;
    isBookmarked: boolean;

    likeCount: number;
    commentCount: number;
    bookmarkCount: number;
};


export interface PostPage {
    posts: PostDTO[];
    nextCursor: string | null;
}