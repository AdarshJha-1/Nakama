import PostCard from "@/components/posts/PostCard";
import { db } from "@/db/drizzle";
import { userFromDB } from "@/db/helper";
import { bookmarks, comments, likes, media, post, user } from "@/db/schema";
import { getServerSession } from "@/lib/getServerSession";
import { Media, PostDTO } from "@/lib/types";
import { eq, sql } from "drizzle-orm";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

interface PageProps {
    params: Promise<{
        postId: string;
    }>;
}

const getPost = cache(async (postId: string, loggedInUserId: string): Promise<PostDTO> => {
    const [dbPost] = await db
        .select({
            id: post.id,
            content: post.content,
            createdAt: post.createdAt,

            author: userFromDB(loggedInUserId),

            media: sql<Media[]>`(
                SELECT json_agg(
                    json_build_object(
                        'id', ${media.id},
                        'url', ${media.url},
                        'type', ${media.type}
                    )
                )
                FROM ${media}
                WHERE ${media.postId} = ${post.id}
            )
            `.as("media"),

            isLiked: sql<boolean>`
                EXISTS (
                    SELECT 1 FROM ${likes}
                    WHERE ${likes.postId} = ${post.id}
                    AND ${likes.userId} = ${loggedInUserId}
                )
                `,
            isBookmarked: sql<boolean>`
                EXISTS (
                    SELECT 1 FROM ${bookmarks}
                    WHERE ${bookmarks.postId} = ${post.id}
                    AND ${bookmarks.userId} = ${loggedInUserId}
                )
                `,
            likeCount: sql<number>`(
                SELECT COUNT(*)::int 
                FROM ${likes} 
                WHERE ${likes.postId} = ${post.id})`
                .as("like_count"),

            bookmarkCount: sql<number>`(
                SELECT COUNT(*)::int 
                FROM ${bookmarks} 
                WHERE ${bookmarks.postId} = ${post.id})`
                .as("bookmark_count"),
            commentCount: sql<number>`(
                SELECT COUNT(*)::int 
                FROM ${comments} 
                WHERE ${comments.postId} = ${post.id})`
                .as("comment_count"),
        })
        .from(post).innerJoin(user, eq(user.id, post.userId))
        .where(
            eq(post.id, postId),
        ).limit(1);
    if (!dbPost) notFound()
    return dbPost;
})

export async function generateMetadata(
    { params }: PageProps
): Promise<Metadata> {
    const session = await getServerSession();
    if (!session) {
        redirect("/login")
    }
    const { postId } = await params
    const post = await getPost(postId, session.user.id);

    return {
        title: `${post.author.name}: ${post.content.slice(0, 50)}...`,
    };
}

export default async function Page({ params }: PageProps) {

    const session = await getServerSession();
    if (!session) {
        redirect("/login")
    }
    const { postId } = await params

    const post = await getPost(postId, session.user.id);

    return (
        <main className="flex w-full min-w-0 gap-5">
            <div className="w-full min-w-0 space-y-5">
                <PostCard post={post} />
            </div>
            {/* <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
                <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
                    <UserInfoSidebar user={post.user} />
                </Suspense>
            </div> */}
        </main>
    );
}
