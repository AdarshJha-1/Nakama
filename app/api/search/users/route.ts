
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { getServerSession } from "@/lib/getServerSession";
import { SearchUser, SearchUsersPage } from "@/lib/types";
import { and, desc, eq, ilike, lt, or } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getServerSession();
    if (!session) {
        return Response.json({
            success: false,
            message: "Unauthorized",
        }, { status: 401 })
    }

    console.log("called");


    const query = req.nextUrl.searchParams.get('q');
    if (!query?.trim()) {
        const data: SearchUsersPage = {
            users: [],
            nextCursor: null
        }
        return Response.json(data, { status: 200 })
    }
    const pageSize = 10;
    const rawCursor = req.nextUrl.searchParams.get("cursor");
    const parsedCursor = rawCursor ? JSON.parse(decodeURIComponent(rawCursor)) : null;

    const rawUsers = await db
        .select({
            id: user.id,
            name: user.name,
            username: user.username,
            image: user.image,
            createdAt: user.createdAt
        })
        .from(user)
        .where(
            and(
                or(
                    ilike(user.username, `%${query}%`),
                    ilike(user.name, `%${query}%`)
                ),
                parsedCursor
                    ? or(
                        lt(user.createdAt, new Date(parsedCursor.createdAt)),
                        and(
                            eq(user.createdAt, new Date(parsedCursor.createdAt)),
                            lt(user.id, parsedCursor.id)
                        )
                    )
                    : undefined
            )
        )
        .orderBy(desc(user.createdAt), desc(user.id))
        .limit(pageSize + 1);

    const hasMore = rawUsers.length > pageSize;
    const usersToReturn = hasMore ? rawUsers.slice(0, pageSize) : rawUsers;
    const nextCursor =
        hasMore && usersToReturn.length
            ? JSON.stringify({
                createdAt: usersToReturn.at(-1)!.createdAt,
                id: usersToReturn.at(-1)!.id,
            })
            : null;

    const formattedUsers: SearchUser[] = usersToReturn.map(u => ({
        id: u.id,
        name: u.name,
        username: u.username,
        image: u.image,
        createdAt: u.createdAt
    }));
    const data: SearchUsersPage = {
        users: formattedUsers,
        nextCursor: nextCursor
    }
    return Response.json(data, { status: 200 })
}