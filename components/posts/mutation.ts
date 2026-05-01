import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePostAction } from "./action";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { PostPage } from "@/lib/types";

export function useDeletePostMutation() {
    const queryClient = useQueryClient();

    const pathname = usePathname();
    const router = useRouter()

    const mutation = useMutation({
        mutationFn: deletePostAction,
        onSuccess: async (res) => {
            const queryFilter: QueryFilters = { queryKey: ["post-feed"] }
            await queryClient.cancelQueries(queryFilter)
            queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
                queryFilter,
                (oldData) => {
                    if (!oldData) return;
                    return {
                        pageParams: oldData?.pageParams,
                        pages: oldData.pages.map(page => ({
                            nextCursor: page.nextCursor,
                            posts: page.posts.filter(p => p.id != res.id)
                        }))
                    }
                }
            )

            queryClient.invalidateQueries({
                queryKey: queryFilter.queryKey,
                predicate(query) {
                    return !query.state.data
                }
            })
            toast.success("Post deleted")
            if (pathname === `/posts/${res.id}`) {
                router.push(`/`)
            }
        },
        onError(error) {
            console.error(error);
            toast.error("Failed to delete post. Please try again.")
        }
    })

    return mutation
}