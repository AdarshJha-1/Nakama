import { Skeleton } from "../ui/skeleton";

export default function PostCardSkeleton() {
    return (
        <div className="min-h-28 bg-card flex items-start gap-3 rounded-2xl px-5 py-3 text-sm">
            <div className="shrink-0">
                <Skeleton className="h-10 w-10 rounded-full" />
            </div>

            <div className="w-full flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-2/4" />
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>

                <Skeleton className="w-2/4 aspect-3/2 rounded-2xl " />

                <div className="flex justify-evenly">
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
        </div>
    )
}
