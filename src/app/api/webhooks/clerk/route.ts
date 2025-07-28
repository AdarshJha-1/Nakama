import { HttpErrorOut, Webhook } from "svix";
import { ClerkMiddlewareAuth, WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    if (!SIGNING_SECRET) {
        throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env')
    }

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET)

    // Get headers
    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Missing Svix headers', {
            status: 400,
        })
    }

    // Get body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    let evt: WebhookEvent

    // Verify payload with headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error: Could not verify webhook:', err)
        return new Response('Error: Verification error', {
            status: 400,
        })
    }

    console.log('Webhook payload:', body)

    if (evt.type === "user.created") {
        const { id, email_addresses, image_url, username } = evt.data;
        try {
            const newUser = await prisma.user.create({
                data: {
                    clerkId: id,
                    username: username,
                    email: email_addresses[0].email_address,
                    avatarUrl: image_url,
                }
            })
            return new Response(JSON.stringify(newUser), {
                status: 201,
            })

        } catch (err) {
            console.error('Error: Failed to store event in the database:', err)
            return new Response('Error: Failed to store event in the database', {
                status: 500,
            });
        }
    }
    if (evt.type === "user.deleted") {
        const { id } = evt.data;
        try {
            await prisma.user.delete({
                where: {
                    clerkId: id
                }
            })
            return new Response("User deleted successfully", {
                status: 200,
            })

        } catch (err: any) {
            if (err?.code === 'P2025') { // user not found
                return new Response("User not found, nothing to delete", { status: 200 });
            }
            console.error('Failed to delete user in database', err);
            return new Response('Error: Failed to delete user in database', { status: 500 });
        }
    }
    return new Response('Webhook received', { status: 200 })
}
