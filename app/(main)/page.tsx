import PostPage from "@/components/posts/PostPage";
import Tiptap from "@/components/posts/editor/Tiptap";
import { getServerSession } from "@/lib/getServerSession";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {

  const session = await getServerSession();
  const user = session?.user;
  if (!user) redirect("/auth")

  return (
    <main className="w-full flex relative ">
      <div className="w-full flex flex-col">
        <div className="hidden sm:block sm:mb-5">
          <Tiptap />
        </div>
        <div className="rounded-full fixed right-10 bottom-20 sm:hidden flex justify-center items-center bg-blue-400 w-12 h-12  hover:bg-accent">
          <Plus size={32} />
        </div>
        <div className="">
          <PostPage />
        </div>
      </div>
    </main>
  )
}
