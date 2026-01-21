"use client"

import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"

import logo from "@/public/images/logo-girl.png"
import img1 from "@/public/gifs/dance-girl.gif"
import img2 from "@/public/gifs/koshi-torako-shikanoko.gif"
import img3 from "@/public/gifs/koyomi-dance.gif"
import img4 from "@/public/gifs/nino-egyn-ninoegyn.gif"
import img5 from "@/public/gifs/one-piece-one-piece-meme.gif"
import img6 from "@/public/gifs/rem.gif"

import Image from "next/image"
import SignInButton from "@/components/SignInButton"

const ImgArray = [img1, img2, img3, img4, img5, img6]

export default function Auth() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <div className="w-full h-14 border-b px-5">
                <div className="max-w-6xl mx-auto h-full flex justify-between items-center">
                    <div className="flex items-center justify-center">
                        <Image
                            src={logo}
                            alt="logo"
                            width={70}
                            height={50}
                        />
                        <h1 className="-tracking-tighter hidden sm:block font-bold text-3xl">Nakama</h1>
                    </div>
                </div>
            </div >

            <main className="flex-1 flex flex-col items-center sm:justify-center gap-3 sm:gap-20 px-4">
                <div className="text-center flex flex-col items-center gap-4">
                    <h1 className="text-2xl sm:text-4xl font-bold tracking-tight pt-2">
                        Hello, <span className="text-primary">Nakama</span> 👋
                    </h1>

                    <p className="text-muted-foreground max-w-md text-sm sm:text-lg">
                        Ready to connect with fellow otakus and share your anime universe?
                    </p>

                    <div className="sm:pt-4">
                        <SignInButton />
                    </div>
                </div>

                <div className="w-full flex justify-center">
                    <div className="relative w-full max-w-sm rounded-2xl border border-border/60 bg-card/70 backdrop-blur shadow-lg overflow-hidden">
                        <Carousel
                            plugins={[
                                Autoplay({
                                    delay: 2800,
                                }),
                            ]}
                        >
                            <CarouselContent>
                                {ImgArray.map((img, index) => (
                                    <CarouselItem key={index}>
                                        <div className="sm:aspect-square h-full aspect-auto sm:h-fit w-full">
                                            <Image
                                                src={img}
                                                alt="anime gif"
                                                className="object-cover w-full h-full"
                                                priority={index === 0}
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </div>
                </div>

            </main>
        </div>
    )
}
