import { db } from "@/db/drizzle";
import { notification } from "@/db/schema";
import { getServerSession } from "@/lib/getServerSession";
import { NotificationCountInfo } from "@/lib/types";
import { and, count, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getServerSession();
    if (!session) {
        return Response.json({
            success: false,
            message: "Unauthorized",
        }, { status: 401 })
    }

    const [result] = await db.select({ count: count() }).from(notification).where(and(eq(notification.recipientId, session.user.id), eq(notification.read, false)));
    const unreadCount = result?.count ?? 0;

    const data: NotificationCountInfo = {
        unreadCount: unreadCount
    }
    return Response.json(data);
}
