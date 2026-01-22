export type UserType = {
    id: string;
    email?: string;
    name: string;
    username: string;
    image?: string | null | undefined;
    role?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
