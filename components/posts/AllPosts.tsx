"use client"

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
            <div className="w-full ">
                <Tabs defaultValue="for-you" className="w-full">
                    <TabsList className="w-full sticky top-19 bg-card">
                        <TabsTrigger value="for-you">For You</TabsTrigger>
                        <TabsTrigger value="following">Following</TabsTrigger>
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

