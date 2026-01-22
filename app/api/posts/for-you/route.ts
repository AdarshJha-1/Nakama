import { db } from "@/db/drizzle";
import { post, user } from "@/db/schema";
import { getServerSession } from "@/lib/getServerSession";
import { desc, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getServerSession();
    if (!session) {
        return Response.json({
            success: false,
            message: "Unauthorized",
        }, { status: 401 })
    }

    const posts = await db.select({
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,

        user: {
            id: user.id,
            name: user.name,
            image: user.image,
            username: user.username
        }
    }).from(post).innerJoin(user, eq(post.userId, user.id)).orderBy(desc(post.createdAt))

    return Response.json(posts)
}