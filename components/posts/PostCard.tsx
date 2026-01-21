export default function PostCard() {
    return (
        <div className="min-h-40 bg-card flex flex-col items-center justify-between">
            <PostCardHeader />
            <div className="">POST DATA</div>
            <PostCardFooter />
        </div>
    )
}

function PostCardHeader() {
    return (
        <div className="w-full text-center bg-accent">Header</div>
    )
}

function PostCardFooter() {
    return (
        <div className="w-full text-center bg-accent">Footer</div>
    )
}