"use client";

import { useEffect, useRef, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SearchPreviewResponse = {
    users: {
        id: string;
        username: string;
        name: string;
        image: string;
    }[];
    posts: {
        id: string;
        content: string;
    }[];
};
export default function SearchSidebar() {
    const pathname = usePathname();

    if (pathname.startsWith("/search")) {
        return null;
    }

    return <SearchBar />;
}

function SearchBar() {

    const currWindow = window.location.host
    console.log(currWindow);


    const router = useRouter();
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query.trim());
        }, 350);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const { data, isPending } = useQuery({
        queryKey: ["search-preview", debouncedQuery],
        queryFn: async () => {
            const res = await fetch(
                `/api/search/preview?q=${encodeURIComponent(debouncedQuery)}`
            );

            if (!res.ok) {
                throw new Error("Failed to search");
            }

            return res.json() as Promise<SearchPreviewResponse>;
        },
        enabled: debouncedQuery.length > 0,
    });

    const handleSearch = () => {
        if (!query.trim()) return;

        setOpen(false);

        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    };

    return (
        <div
            ref={wrapperRef}
            className="relative w-full max-w-md lg:max-w-xl"
        >
            <div className="flex">
                <Input
                    value={query}
                    type="search"
                    placeholder="Search..."
                    onFocus={() => setOpen(true)}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                    className="
                        h-11
                        rounded-r-none
                        rounded-l-xl
                        border-r-0
                        focus-visible:ring-0
                    "
                />

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleSearch}
                    className="
                        h-11
                        rounded-l-none
                        border-l-0
                        px-4
                    "
                >
                    <SearchIcon className="size-5" />
                </Button>
            </div>

            {open && debouncedQuery && (
                <div
                    className="
                        absolute
                        left-0
                        top-full
                        z-50
                        mt-2
                        w-full
                        overflow-hidden
                        rounded-2xl
                        border
                        bg-card
                        shadow-xl
                    "
                >
                    {isPending ? (
                        <div className="p-6 text-center text-sm text-muted-foreground">
                            Searching...
                        </div>
                    ) : (
                        <>
                            {!!data?.users.length && (
                                <div className="border-b p-3">
                                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Users
                                    </h3>

                                    <div className="space-y-1">
                                        {data.users.map((user) => (
                                            <Link
                                                key={user.id}
                                                href={`/users/${user.username}`}
                                                onClick={() =>
                                                    setOpen(false)
                                                }
                                                className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-muted"
                                            >
                                                <Image
                                                    src={user.image}
                                                    alt={user.name}
                                                    width={40}
                                                    height={40}
                                                    className="size-10 shrink-0 rounded-full object-cover"
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
                                    </div>
                                </div>
                            )}

                            {!!data?.posts.length && (
                                <div className="border-b p-3">
                                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Posts
                                    </h3>

                                    <div className="space-y-1">
                                        {data.posts.map((post) => (
                                            <Link
                                                key={post.id}
                                                href={`/posts/${post.id}`}
                                                onClick={() =>
                                                    setOpen(false)
                                                }
                                                className="block rounded-xl p-3 transition hover:bg-muted"
                                            >
                                                <p className="line-clamp-2 text-sm">
                                                    {post.content}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!data?.users.length &&
                                !data?.posts.length && (
                                    <div className="p-6 text-center text-sm text-muted-foreground">
                                        No results found.
                                    </div>
                                )}

                            <div className="p-2">
                                <Button
                                    variant="ghost"
                                    className="w-full rounded-xl"
                                    onClick={handleSearch}
                                >
                                    See all results →
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}