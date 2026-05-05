"use client";

import Image from "next/image";
import { ImageDown, X } from "lucide-react";
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
import { useEffect, useState } from "react";
import CommentButton from "./CommentsButton";
import Comments from "../comments/Comments";
import { Button } from "../ui/button";

export default function PostCard({ post }: { post: PostDTO }) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [showComments, setShowComments] = useState(false);

    const { session } = useSession();
    const router = useRouter();

    if (!session) {
        router.push("/auth");
        return null;
    }

    const formattedDate = formatDate(new Date(post.createdAt).getTime());

    return (
        <div className="bg-card sm:rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition">
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
                <div className="cursor-pointer" onClick={() => router.push(`/posts/${post.id}`)}>
                    <p className="text-[18px] leading-relaxed whitespace-pre-wrap">
                        {post.content}
                    </p>
                </div>
            )}

            {post.media?.length > 0 && (
                <MediaGrid media={post.media} setActiveIndex={setActiveIndex} />
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
                    <CommentButton
                        count={post.commentCount}
                        setShowComments={() => setShowComments(!showComments)}
                    />
                </div>

                <BookmarkButton
                    postId={post.id}
                    initialState={{
                        bookmarks: post.bookmarkCount,
                        isBookmarkedByUser: post.isBookmarked,
                    }}
                />
            </div>

            {activeIndex !== null && (
                <MediaModal
                    media={post.media}
                    index={activeIndex}
                    setIndex={setActiveIndex}
                    onClose={() => setActiveIndex(null)}
                />
            )}

            {showComments && <Comments post={post} />}
        </div>
    );
}

function MediaGrid({
    media,
    setActiveIndex,
}: {
    media: Media[];
    setActiveIndex: (index: number) => void;
}) {
    const count = media.length;

    return (
        <div
            className={cn(
                "grid gap-2 rounded-2xl overflow-hidden",
                count === 1 && "grid-cols-1",
                count === 2 && "grid-cols-2",
                count === 3 && "grid-cols-2 grid-rows-2 h-105",
                count >= 4 && "grid-cols-2 grid-rows-2"
            )}
        >
            {media.slice(0, 4).map((m, i) => (
                <MediaItem
                    key={m.id}
                    media={m}
                    index={i}
                    total={count}
                    setActiveIndex={setActiveIndex}
                />
            ))}
        </div>
    );
}

function MediaItem({
    media,
    index,
    total,
    setActiveIndex,
}: {
    media: Media;
    index: number;
    total: number;
    setActiveIndex: (index: number) => void;
}) {
    const isThree = total === 3;

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(index);
            }}
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
    index,
    setIndex,
    onClose,
}: {
    media: Media[];
    index: number;
    setIndex: (i: number | null) => void;
    onClose: () => void;
}) {
    const prev = () => {
        setIndex((index - 1 + media.length) % media.length);
    };

    const next = () => {
        setIndex((index + 1) % media.length);
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [index, media.length, onClose]);

    const handleDownload = async () => {
        try {
            const url = media[index].url;

            const fileName =
                url.split("/").pop()?.split("?")[0] || `image-${index}.jpg`;

            const res = await fetch(url);
            const blob = await res.blob();

            const blobUrl = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();

            a.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error("Download failed", err);
        }
    };

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="absolute top-5 right-5 bg-white hover:bg-accent-foreground rounded-full p-2"
            >
                <X className="size-5 text-black" />
            </button>

            {media.length > 1 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        prev();
                    }}
                    className="absolute left-5 text-white text-4xl"
                >
                    ‹
                </button>
            )}

            <div
                onClick={(e) => e.stopPropagation()}
                className="max-w-[90vw] max-h-[90vh]"
            >
                <Image
                    src={media[index].url}
                    alt="zoomed media"
                    width={1200}
                    height={1200}
                    className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-xl"
                />
            </div>

            {media.length > 1 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        next();
                    }}
                    className="absolute right-5 text-white text-4xl"
                >
                    ›
                </button>
            )}
            <Button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                }}
                className="absolute top-5 left-5 bg-white hover:bg-accent-foreground rounded-full px-3 py-1 text-sm"
            >
                <ImageDown />
                Download
            </Button>
        </div>
    );
}