export type PostWithUser = {
    id: string;
    content: string;
    createdAt: Date;
    user: {
        id: string;
        name: string;
        username: string;
        image: string | null;
    };
};
