"use client";

import { useEffect, useState } from "react";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SearchIcon } from "lucide-react";

import SearchedPostPage from "./SearchPostPage";
import SearchedUsersPage from "./SearchUsersPage";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query.trim());
        }, 350);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <main className="flex w-155">
            <div className="w-full">
                <Tabs defaultValue="posts" className="w-full">
                    <div className="border-b bg-card sm:rounded-xl">
                        <div className="px-5 py-4">
                            <InnerSearchBar
                                query={query}
                                setQuery={setQuery}
                            />
                        </div>

                        <TabsList className="grid h-12 w-full grid-cols-2 rounded-none bg-transparent p-0">
                            <TabsTrigger
                                value="posts"
                                className="
                                    h-full rounded-xl border-b-2 border-transparent
                                    data-[state=active]:border-primary
                                    data-[state=active]:bg-transparent
                                    data-[state=active]:shadow-none
                                    font-medium cursor-pointer
                                "
                            >
                                Posts
                            </TabsTrigger>

                            <TabsTrigger
                                value="users"
                                className="
                                    h-full rounded-xl border-b-2 border-transparent
                                    data-[state=active]:border-primary
                                    data-[state=active]:bg-transparent
                                    data-[state=active]:shadow-none
                                    font-medium cursor-pointer
                                "
                            >
                                Users
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="posts" className="mt-2">
                        <SearchedPostPage query={debouncedQuery} />
                    </TabsContent>

                    <TabsContent value="users" className="mt-2">
                        <SearchedUsersPage query={debouncedQuery} />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}

type InnerSearchBarProps = {
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
};

function InnerSearchBar({
    query,
    setQuery,
}: InnerSearchBarProps) {
    return (
        <div className="flex">
            <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Search..."
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
    );
}