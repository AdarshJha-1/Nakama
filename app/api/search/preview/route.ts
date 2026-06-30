import { db } from "@/db/drizzle";
import { post, user } from "@/db/schema";
import { getServerSession } from "@/lib/getServerSession";
import { ilike, or } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
) {
    try {
        const session = await getServerSession();
        if (!session) {
            return Response.json({
                success: false,
                message: "Unauthorized",
            }, { status: 401 })
        }

        const query = req.nextUrl.searchParams.get('q');
        if (!query?.trim()) {
            return Response.json({
                users: [],
                posts: []
            }, { status: 200 })
        }

        const [previewUsers, previewPosts] = await Promise.all([
            db.query.user.findMany({
                columns: {
                    id: true,
                    image: true,
                    username: true,
                    name: true,
                },
                where: or(ilike(user.username, `%${query}%`), ilike(user.name, `%${query}%`)),
                limit: 5
            }),

            db.query.post.findMany({
                columns: { content: true, id: true, createdAt: true },
                where: ilike(post.content, `%${query}%`),
                limit: 3
            })
        ])

        return Response.json({
            users: previewUsers,
            posts: previewPosts
        }, { status: 200 })



    } catch (error) {
        console.error(error)
        return Response.json({
            success: false,
            message: "Something went wrong",
        }, { status: 500 })
    }
}