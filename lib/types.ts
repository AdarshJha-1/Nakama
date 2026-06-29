export type UserDTO = {
    id: string;
    name: string;
    username: string;
    image: string | null;
    createdAt: Date;

    isFollowed: boolean;
    followerCount: number;
    postsCount: number;
};

export type PostDTO = {
    id: string;
    content: string;
    createdAt: Date;

    author: UserDTO;
    media: Media[];
    isLiked: boolean;
    isBookmarked: boolean;

    likeCount: number;
    commentCount: number;
    bookmarkCount: number;
};

export type CommentDTO = {
    id: string;
    content: string;
    author: UserDTO;
    isEdited: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type NotificationDTO = {
    id: string;
    recipientId: string;
    issuerId: string;
    postId: string | null;
    type: string;
    read: boolean | null;
    createdAt: Date;
    withData: {
        issuer: {
            username: string;
            name: string;
            image: string | null;
        };

        post?: {
            content: string;
        } | null;
    };
}


export interface NotificationPage {
    notifications: NotificationDTO[];
    nextCursor: string | null;
}


export type MEDIA = "IMAGE" | "VIDEO"


export type Media = {
    id: string
    url: string
    type: MEDIA
}

export interface FollowerInfo {
    followers: number;
    isFollowedByUser: boolean;
}

export interface PostPage {
    posts: PostDTO[];
    nextCursor: string | null;
}

export interface CommentsPage {
    comments: CommentDTO[];
    nextCursor: string | null;
}

export interface LikeInfo {
    likes: number;
    isLikedByUser: boolean
}

export interface BookmarkInfo {
    bookmarks: number;
    isBookmarkedByUser: boolean
}

export interface NotificationCountInfo {
    unreadCount: number;
}