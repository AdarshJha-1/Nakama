import React from 'react'

import { getServerSession } from '@/lib/getServerSession';
import { redirect } from 'next/navigation';
import SessionProvider from './SessionProvider';
import Navbar from '@/components/Navbar';
import LeftSidebar from '@/components/LeftSidebar';

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession();
    if (!session?.user) redirect("/auth");

    return (
        <SessionProvider value={session}>
            <div className="flex min-h-screen flex-col">
                <Navbar className='sticky top-0 z-10 bg-card' />
                <div className="w-full max-w-3xl mx-auto flex py-2 sm:p-5 grow gap-5 ">
                    <div className="hidden sm:block h-fit sticky top-19">
                        <LeftSidebar className='hidden sm:flex ' />
                    </div>
                    {children}
                </div>
                <div className="sm:hidden fixed bottom-0 left-0 w-full bg-card border-t z-50">
                    <LeftSidebar />
                </div>
            </div>
        </SessionProvider>
    );
}
