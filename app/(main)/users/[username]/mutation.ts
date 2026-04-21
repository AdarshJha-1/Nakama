import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserProfileType } from "@/lib/validation";
import { QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUserProfile } from "./action";
import { useRouter } from "next/navigation";


export function useUpdateProfileMutation() {

    const router = useRouter()
    const { startUpload: startAvatarUpload } = useUploadThing("avatar")

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async ({ values, avatar }: { values: UpdateUserProfileType, avatar?: File }) => {
            return Promise.all([
                updateUserProfile(values),
                avatar && startAvatarUpload([avatar])
            ])
        },
        onSuccess: async ([updatedUser, uploadRes]) => {
            const newAvatarUrl = uploadRes[0].serverData.image


            const queryFilter: QueryFilters = { queryKey: ["post-feed"] }

            await queryClient.cancelQueries(queryFilter)

            queryClient.setQueriesData(
                queryFilter,
                (oldData: any) => {
                    if (!oldData) return;
                    return {
                        pageParams: oldData?.pageParams,
                        pages: oldData.pages.map(page => ({
                            nextCursor: page.nextCursor,
                            posts: page.posts.map(post => {
                                if (post.userId === updatedUser.id) {
                                    return {
                                        ...post,
                                        author: {
                                            ...updatedUser,
                                            image: newAvatarUrl || updatedUser.image
                                        }
                                    }
                                }
                                return post
                            })
                        }))
                    }
                }
            )
            router.refresh()
            toast.success("Profile updated")
        },
        onError(error) {
            toast.error("Failed to update profile. Please try again")
        }
    })
    return mutation
}