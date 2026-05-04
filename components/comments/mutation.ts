import { InfiniteData, QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommentAction, deleteCommentActions } from "./action";
import { CommentsPage } from "@/lib/types";
import { toast } from "sonner";

export function useSubmitCommentMutation(postId: string) {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: createCommentAction,
        onSuccess: async (res) => {
            const queryKey: QueryKey = ["comments", postId]

            await queryClient.cancelQueries({ queryKey })

            queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
                queryKey,
                (oldData) => {
                    if (!oldData) return;
                    const firstPage = oldData.pages[0];
                    if (firstPage) {
                        return {
                            pageParams: oldData.pageParams,
                            pages: [
                                {
                                    comments: [res, ...firstPage.comments],
                                    nextCursor: firstPage.nextCursor
                                },
                                ...oldData.pages.slice(1)
                            ]
                        }
                    }
                }
            )
            queryClient.invalidateQueries({
                queryKey,
                predicate(query) {
                    return !query.state.data
                },
            })

            toast.success("Comment created")
        },

        onError(error) {
            console.error(error);
            toast.error("Failed to comment. Please try again.")
        }
    })

    return mutation
}


export function useDeleteCommentMutation() {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: deleteCommentActions,
        onSuccess: async (res) => {
            const queryKey: QueryKey = ["comments", res.postId]
            await queryClient.cancelQueries({ queryKey })

            queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
                queryKey,
                (oldData) => {
                    if (!oldData) return;
                    return {
                        pageParams: oldData?.pageParams,
                        pages: oldData.pages.map(page => ({
                            nextCursor: page.nextCursor,
                            comments: page.comments.filter(c => c.id != res.id)
                        }))
                    }
                }
            )

            queryClient.invalidateQueries({
                queryKey,
                predicate(query) {
                    return !query.state.data
                }
            })
            toast.success("Comment deleted")
        }, onError(error) {
            console.error(error);
            toast.error("Failed to delete post. Please try again.")
        }
    })

    return mutation
}