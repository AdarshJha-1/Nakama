import { getServerSession } from '@/lib/getServerSession';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession();
    if (session?.user) redirect("/");

    return (
        <div className="w-full min-h-screen">
            {children}
        </div>
    );
}
