import PostCard from "./PostCard";

export default function AllPosts() {
    return (
        <div className="flex flex-col gap-5">
            {
                Array.from({ length: 100 }).map((v, i) => (
                    <PostCard key={i} />
                ))
            }
        </div>
    )
}
