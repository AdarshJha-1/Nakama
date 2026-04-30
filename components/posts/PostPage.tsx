import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import ForYouPage from "../ForYouPage";
import FollowingPage from "../FollowingPage";

export default function PostPage() {

    return (
        <div className="flex flex-col gap-5">
            <div className="w-full">
                <Tabs defaultValue="for-you" className="w-full">
                    <TabsList className="w-full bg-card rounded-none sm:rounded-2xl">
                        <TabsTrigger value="for-you" className="cursor-pointer">For You</TabsTrigger>
                        <TabsTrigger value="following" className="cursor-pointer">Following</TabsTrigger>
                    </TabsList>
                    <TabsContent value="for-you">
                        <ForYouPage />
                    </TabsContent>
                    <TabsContent value="following">
                        <FollowingPage />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

