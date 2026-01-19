import CreatePostBar from "@/components/CreatePostBar";
import LeftSidebar from "@/components/LeftSidebar";
import AllPosts from "@/components/posts/AllPosts";
// import UserProfile from "@/components/UserProfile";
import { getServerSession } from "@/lib/getServerSession";
import Image from "next/image";

export default async function Home() {

  const session = await getServerSession();
  const user = session?.user;
  if (!user) {
    return (
      <div className="">Sign In lil bro</div>
    )
  }
  // if (!user) redirect("/auth")
  return (
    <main className="min-h-screen max-w-6xl mx-auto text-center flex pt-5 gap-20">
      <LeftSidebar />
      <div className="w-full flex flex-col gap-1">
        <div className="flex gap-5 h-15 items-start">
          {/* <UserProfile user={user} /> */}
          <Image className="rounded-full" src={user.image as string} width={60} height={60} alt="avatar" />
          <CreatePostBar />
        </div>
        <AllPosts />
      </div>
    </main>
  )
}
