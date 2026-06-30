"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";

import InfiniteLoading from "@/components/InfiniteLoading";
import { SearchUsersPage } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    query: string;
};

export default function SearchedUsersPage({ query }: Props) {

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isPending,
        status,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["search-users", query],
        queryFn: async ({ pageParam }) => {
            const params = new URLSearchParams();

            params.set("q", query);

            if (pageParam) {
                params.set("cursor", pageParam);
            }

            const res = await fetch(`/api/search/users?${params}`);

            if (!res.ok) {
                throw new Error("Failed to search users");
            }

            return res.json() as Promise<SearchUsersPage>;
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: query.trim().length > 0,
    });

    const users =
        data?.pages.flatMap((page) => page.users) ?? [];

    if (query.trim() && isPending) {
        return (
            <div className="space-y-4">
                <UserCardSkeleton />
                <UserCardSkeleton />
                <UserCardSkeleton />
            </div>
        );
    }

    if (status === "error") {
        return (
            <p className="py-8 text-center text-destructive">
                Something went wrong.
            </p>
        );
    }

    if (!users.length) {
        return (
            <section className="rounded-2xl border bg-card">
                <p className="p-8 text-center text-muted-foreground">
                    No users found.
                </p>
            </section>
        );
    }

    return (
        <section className="overflow-hidden sm:rounded-xl ">

            <InfiniteLoading
                className="flex flex-col gap-3 p-3"
                onBottomReached={() => {
                    if (hasNextPage && !isFetching) {
                        fetchNextPage();
                    }
                }}
            >
                {users.map((user) => (
                    <Link
                        key={user.id}
                        href={`/users/${user.username}`}
                        className="
                            flex items-center gap-4
                            rounded-xl border bg-card
                            p-4
                            transition
                            hover:bg-muted
                            "
                    >
                        <Image
                            src={user.image as string}
                            alt={user.name}
                            width={52}
                            height={52}
                            className="rounded-full object-cover"
                        />

                        <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold">
                                {user.name}
                            </p>

                            <p className="truncate text-sm text-muted-foreground">
                                @{user.username}
                            </p>
                        </div>
                    </Link>
                ))}

                {isFetchingNextPage && (
                    <div className="flex justify-center py-5">
                        <Loader2 className="animate-spin" />
                    </div>
                )}
            </InfiniteLoading>
        </section>
    );
}


function UserCardSkeleton() {
    return (
        <div className="flex items-center gap-4 border-b p-4 last:border-0">
            <Skeleton className="size-13 rounded-full shrink-0" />

            <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-28" />
            </div>

            <Skeleton className="h-9 w-20 rounded-full" />
        </div>
    );
}