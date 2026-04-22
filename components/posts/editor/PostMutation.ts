import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPostAction } from "./createPostAction";
import { toast } from "sonner";
import { PostPage } from "@/lib/types";

export function useSubmitPostMutation() {

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: createPostAction,
        onSuccess: async (res) => {
            const queryFilter: QueryFilters = { queryKey: ["post-feed", "for-you"] }

            await queryClient.cancelQueries(queryFilter)

            queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
                queryFilter,
                (oldData) => {
                    if (!oldData) return;
                    const firstPage = oldData?.pages[0];
                    if (firstPage) {
                        return {
                            pageParams: oldData?.pageParams,
                            pages: [
                                {
                                    posts: [res, ...firstPage.posts],
                                    nextCursor: firstPage.nextCursor
                                },
                                ...oldData?.pages.slice(1)
                            ]
                        }
                    }

                }
            )

            queryClient.invalidateQueries({
                queryKey: queryFilter.queryKey,
                predicate(query) {
                    return !query.state.data
                }
            })
            toast.success("Post created")

        },
        onError(error) {
            console.error(error);
            toast.error("Failed to post. Please try again.")
        }
    })

    return mutation
}