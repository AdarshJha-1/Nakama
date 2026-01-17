import Image from "next/image";

import logo from "@/public/images/logo-girl.png"

import { DarkModeToggle } from "./DarkModeToggle";

export default function Navbar() {
    return (
        <div className="w-full h-17 border-b">
            <div className="max-w-6xl mx-auto h-full flex justify-between items-center">
                <div className="flex items-center justify-center">
                    <Image
                        src={logo}
                        alt="logo"
                        width={80}
                        height={60}
                    />
                    <h1 className="-tracking-tighter font-bold text-4xl">Nakama</h1>
                </div>
                <div className="flex">
                    <DarkModeToggle />
                </div>
            </div>
        </div>
    )
}
