import { db } from "@/db/drizzle";
import { notification } from "@/db/schema";
import { getServerSession } from "@/lib/getServerSession";
import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
    const session = await getServerSession();
    if (!session) {
        return Response.json({
            success: false,
            message: "Unauthorized",
        }, { status: 401 })
    }

    await db.update(notification).set({ read: true }).where(and(eq(notification.recipientId, session.user.id), eq(notification.read, false)))


    return new Response();
}
