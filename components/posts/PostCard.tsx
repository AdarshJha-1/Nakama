"use client";

import Image from "next/image";
import { MessageCircleIcon, X } from "lucide-react";
import Link from "next/link";
import PostMore from "./PostMore";
import { Media, PostDTO } from "@/lib/types";
import { formatDate } from "@/lib/date-format";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/(main)/SessionProvider";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function PostCard({ post }: { post: PostDTO }) {
    const [activeMedia, setActiveMedia] = useState<Media | null>(null);

    const { session } = useSession();
    const router = useRouter();

    if (!session) {
        router.push("/auth");
        return null;
    }

    const formattedDate = formatDate(new Date(post.createdAt).getTime());

    return (
        <div onClick={() => router.push(`/posts/${post.id}`)} className="bg-card sm:rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition cursor-pointer">
            <div className="flex justify-between items-start">
                <div className="flex gap-3">
                    <Link href={`/users/${post.author.username}`} onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={post.author.image as string}
                            width={44}
                            height={44}
                            alt="avatar"
                            className="rounded-full object-cover"
                        />
                    </Link>

                    <div className="flex flex-col">
                        <Link
                            href={`/users/${post.author.username}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-semibold hover:underline"
                        >
                            {post.author.name}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                            {formattedDate}
                        </span>
                    </div>
                </div>

                {post.author.id === session?.userId && (
                    <PostMore id={post.id} />
                )}
            </div>

            {post.content && (
                <p className="text-[18px] leading-relaxed whitespace-pre-wrap">
                    {post.content}
                </p>
            )}

            {post.media?.length > 0 && (
                <MediaGrid media={post.media} setActiveMedia={setActiveMedia} />
            )}

            <Separator className="bg-muted/50" />

            <div className="flex justify-between items-center text-muted-foreground">
                <div className="flex gap-5 items-center">
                    <LikeButton
                        postId={post.id}
                        initialState={{
                            likes: post.likeCount,
                            isLikedByUser: post.isLiked,
                        }}
                    />

                    <div className="flex items-center gap-2 text-sm">
                        <MessageCircleIcon className="size-4" />
                        {post.commentCount}
                    </div>
                </div>

                <BookmarkButton
                    postId={post.id}
                    initialState={{
                        bookmarks: post.bookmarkCount,
                        isBookmarkedByUser: post.isBookmarked,
                    }}
                />
            </div>
            {activeMedia && (
                <MediaModal
                    media={activeMedia}
                    onClose={() => setActiveMedia(null)}
                />
            )}
        </div>
    );
}


function MediaGrid({ media, setActiveMedia }: { media: Media[], setActiveMedia: (m: Media) => void }) {
    const count = media.length;

    return (
        <div
            className={cn(
                "grid gap-2 rounded-2xl overflow-hidden",
                count === 1 && "grid-cols-1",
                count === 2 && "grid-cols-2",
                count === 3 && "grid-cols-2 grid-rows-2 h-105",
                count >= 4 && "grid-cols-2 grid-rows-2 h"
            )}
        >
            {media.slice(0, 4).map((m, i) => (
                <MediaItem setActiveMedia={setActiveMedia} key={m.id} media={m} index={i} total={count} />
            ))}
        </div>
    );
}

function MediaItem({
    media,
    index,
    total,
    setActiveMedia,

}: {
    media: Media;
    index: number;
    total: number;
    setActiveMedia: (m: Media) => void
}) {
    const isThree = total === 3;

    return (
        <div
            onClick={(e) => {
                e.stopPropagation()
                setActiveMedia(media)
            }
            }
            className={cn(
                "relative overflow-hidden rounded-xl bg-black/5",
                isThree && index === 0 && "row-span-2"
            )}
        >
            <Image
                src={media.url}
                alt="media"
                width={1000}
                height={1000}
                className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-300"
            />
        </div>
    );
}

function MediaModal({
    media,
    onClose,
}: {
    media: Media;
    onClose: () => void;
}) {
    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                onClose()
            }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose()
                }}
                className="absolute top-5 right-5 text-black text-2xl bg-accent-foreground rounded-full p-2 hover:bg-accent-foreground/80 transition-colors duration-200"
            >
                <X className="size-5 text-xl font-bold" />
            </button>

            <div
                onClick={(e) => e.stopPropagation()}
                className="max-w-[90vw] max-h-[90vh]"
            >
                <Image
                    src={media.url}
                    alt="zoomed media"
                    width={1200}
                    height={1200}
                    className="w-full h-full object-contain rounded-xl"
                />
            </div>
        </div>
    );
}