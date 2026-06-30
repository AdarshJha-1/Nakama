import Bookmarks from './Bookmarks'

export default function page() {
    return (
        <main className="flex w-155 min-w-0 gap-5">
            <div className="w-full min-w-0 space-y-5">
                <div className="sm:rounded-2xl bg-card p-5 shadow-sm">
                    <h1 className="text-center text-2xl font-bold">Bookmarks</h1>
                </div>
                <Bookmarks />
            </div>
        </main>
    )
}
