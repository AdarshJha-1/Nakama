import Image from "next/image";

import logo from "@/public/images/logo-girl.png"
import Link from "next/link";
import Auth from "./Auth";

export default function Navbar({ className }: { className?: string }) {
    return (
        <div className={`w-full h-14 z-50 border-b px-5 ${className}`}>
            <div className="max-w-6xl mx-auto h-full flex justify-between items-center">
                <Link href={"/"} className="flex items-center justify-center">
                    <Image
                        src={logo}
                        alt="logo"
                        width={70}
                        height={50}
                    />
                    <h1 className="-tracking-tighter hidden sm:block font-bold text-3xl">Nakama</h1>
                </Link>
                <Auth />
            </div>
        </div >
    )
}