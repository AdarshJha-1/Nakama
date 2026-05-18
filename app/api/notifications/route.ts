import { db } from "@/db/drizzle";
import { notification } from "@/db/schema";
import { getServerSession } from "@/lib/getServerSession";
import { NotificationDTO, NotificationPage } from "@/lib/types";
import { and, desc, eq, lt, or } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getServerSession();
    if (!session) {
        return Response.json({
            success: false,
            message: "Unauthorized",
        }, { status: 401 })
    }

    const pageSize = 10;
    const rawCursor = req.nextUrl.searchParams.get("cursor");
    const parsedCursor = rawCursor ? JSON.parse(decodeURIComponent(rawCursor)) : null;

    const rawNotifications = await db.query.notification.findMany({
        where: and(
            eq(notification.recipientId, session.user.id),
            parsedCursor
                ? or(
                    lt(notification.createdAt, new Date(parsedCursor.createdAt)),
                    and(
                        eq(notification.createdAt, new Date(parsedCursor.createdAt)),
                        lt(notification.id, parsedCursor.id)
                    )
                )
                : undefined,
        ),
        with: {
            issuer: {
                columns: {
                    image: true,
                    name: true,
                    username: true
                }
            },
            post: {
                columns: {
                    content: true
                }
            }
        },
        limit: (pageSize + 1),
        orderBy: [desc(notification.createdAt), desc(notification.id)]
    })


    const hasMore = rawNotifications.length > pageSize;
    const notificationToReturn = hasMore ? rawNotifications.slice(0, pageSize) : rawNotifications;

    const nextCursor =
        hasMore && notificationToReturn.length > 0
            ?
            JSON.stringify({
                createdAt: notificationToReturn[notificationToReturn.length - 1].createdAt,
                id: notificationToReturn[notificationToReturn.length - 1].id,
            })
            : null;
    const formattedNotification: NotificationDTO[] = notificationToReturn.map(n => ({
        id: n.id,
        issuerId: n.issuerId,
        recipientId: n.recipientId,
        type: n.type,
        postId: n.postId,
        withData: {
            issuer: {
                username: n.issuer.username,
                name: n.issuer.name,
                image: n.issuer.image,
            },

            post: n.post
                ? {
                    content: n.post.content,
                }
                : null,
        },
        createdAt: n.createdAt,
        read: n.read
    }));
    const data: NotificationPage = {
        notifications: formattedNotification,
        nextCursor: nextCursor
    }
    return Response.json(data, { status: 200 })
}

