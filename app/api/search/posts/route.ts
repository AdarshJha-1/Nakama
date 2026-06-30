
import { db } from "@/db/drizzle";
import { media, post, user } from "@/db/schema";
import { getServerSession } from "@/lib/getServerSession";
import { Media, SearchPost, SearchPostsPage } from "@/lib/types";
import { and, desc, eq, ilike, lt, or, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getServerSession();
    if (!session) {
        return Response.json({
            success: false,
            message: "Unauthorized",
        }, { status: 401 })
    }


    const query = req.nextUrl.searchParams.get('q');
    if (!query?.trim()) {
        const data: SearchPostsPage = {
            posts: [],
            nextCursor: null
        }
        return Response.json(data, { status: 200 })
    }
    const pageSize = 10;
    const rawCursor = req.nextUrl.searchParams.get("cursor");
    const parsedCursor = rawCursor ? JSON.parse(decodeURIComponent(rawCursor)) : null;

    const rawPosts = await db
        .select({
            id: post.id,
            content: post.content,
            createdAt: post.createdAt,
            author: {
                id: user.id,
                name: user.name,
                username: user.username,
                image: user.image,
                createdAt: user.createdAt,
            },
            media: sql<Media>`(
                SELECT json_build_object(
                        'id', ${media.id},
                        'url', ${media.url},
                        'type', ${media.type}
                    )
                FROM ${media}
                WHERE ${media.postId} = ${post.id}
                LIMIT 1
            )
            `.as("media"),
        })
        .from(post).innerJoin(user, eq(user.id, post.userId))
        .where(
            and(
                or(
                    ilike(post.content, `%${query}%`),
                ),
                parsedCursor
                    ? or(
                        lt(post.createdAt, new Date(parsedCursor.createdAt)),
                        and(
                            eq(post.createdAt, new Date(parsedCursor.createdAt)),
                            lt(post.id, parsedCursor.id)
                        )
                    )
                    : undefined
            )
        )
        .limit(pageSize + 1)
        .orderBy(desc(post.createdAt), desc(post.id))


    const hasMore = rawPosts.length > pageSize;
    const postsToReturn = hasMore ? rawPosts.slice(0, pageSize) : rawPosts;

    const nextCursor =
        hasMore && postsToReturn.length > 0
            ?
            JSON.stringify({
                createdAt: postsToReturn[postsToReturn.length - 1].createdAt,
                id: postsToReturn[postsToReturn.length - 1].id,
            })
            : null;

    const formattedPosts: SearchPost[] = postsToReturn.map(p => ({
        id: p.id,
        content: p.content,
        createdAt: p.createdAt,
        author: {
            id: p.author.id,
            name: p.author.name,
            username: p.author.username,
            image: p.author.image,
            createdAt: p.author.createdAt,
        },
        media: p.media,
    }));
    const data: SearchPostsPage = {
        posts: formattedPosts,
        nextCursor: nextCursor
    }
    return Response.json(data, { status: 200 })
}