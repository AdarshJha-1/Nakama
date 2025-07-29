import AddPost from "@/components/AddPost";
import LeftSidebar from "@/components/LeftSidebar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full pt-5">
      <div className="w-full ">
        <AddPost />
      </div>
    </div>

  );
}
