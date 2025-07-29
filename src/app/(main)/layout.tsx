import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import { auth } from "@clerk/nextjs/server";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { isAuthenticated } = await auth()

    if (!isAuthenticated) {
        return <div className="text-red-600 flex justify-center text-2xl">Please Signin first to use the application</div>
    }

    return (
        <div className="flex min-h-screen flex-col">
            {isAuthenticated && <Header />}
            <div className="mx-auto flex w-full max-w-7xl grow gap-5 px-8 ">
                <LeftSidebar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-70" />
                {children}
            </div>
            <LeftSidebar className="sticky  bottom-0 flex w-full justify-center gap-5 border-t  p-3 sm:hidden" />
        </div>
    );
}
