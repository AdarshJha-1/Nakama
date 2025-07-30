'use client';

import { SignInButton, useUser } from '@clerk/nextjs';
import { ShowCarousel } from '@/components/ShowCarousel';

export default function ShowPage() {
    const { isSignedIn } = useUser();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
            <main className="flex-grow flex flex-col gap-6 items-center justify-center text-center px-4">
                <div className="max-w-2xl">
                    <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-br from-accent via-primary to-secondary bg-clip-text text-transparent drop-shadow-lg animate-fade-up">
                        Welcome to Nakama!
                    </h2>
                    <p className="mb-8 text-lg text-muted-foreground font-medium animate-fade-up [animation-delay:0.15s]">
                        Join the fun—post, chat, and celebrate anime with friends on Nakama!
                    </p>
                    {!isSignedIn && (
                        <SignInButton>
                            <button className="rounded-full px-8 py-3 mt-4 text-lg font-bold bg-sidebar-accent text-primary-foreground shadow-lg hover:scale-105 transition">
                                Come aboard &mdash; join Nakama!
                            </button>
                        </SignInButton>
                    )}
                </div>
                <ShowCarousel />
            </main>
        </div>
    );
}
