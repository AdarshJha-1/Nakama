import LeftSidebar from "@/components/LeftSidebar";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <div className="flex min-h-screen flex-col">
            <div className="mx-auto flex w-full max-w-7xl grow gap-5 px-8 ">
                <LeftSidebar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl px-3 py-5 shadow-sm dark:shadow-muted dark:shadow-sm sm:block lg:px-5 xl:w-70" />
                {children}
            </div>
            <LeftSidebar className="sticky  bottom-0 flex w-full justify-center gap-5 border-t  p-3 sm:hidden" />
        </div>
    );
}
