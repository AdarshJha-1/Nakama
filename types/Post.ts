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