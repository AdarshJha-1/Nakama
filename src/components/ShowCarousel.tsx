"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import gif0 from "../../public/koyomi-dance.gif"
import gif1 from "../../public/dance-girl.gif"
import gif2 from "../../public/koshi-torako-shikanoko.gif"
import gif3 from "../../public/anime-anime-dance.gif"
import gif4 from "../../public/nino-egyn-ninoegyn.gif"
import gif5 from "../../public/one-piece-one-piece-meme.gif"
import { CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,

} from "@/components/ui/carousel"
import Image from "next/image"

export function ShowCarousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 2600, stopOnInteraction: true })
    )

    const gifs = [gif0, gif1, gif2, gif3, gif4, gif5];
    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-xs"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                {gifs.map((gif, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <CardContent className="flex aspect-square items-center justify-center">
                                <Image
                                    src={gif}
                                    alt="Anime gif"
                                    className="rounded-xl border-gray-600 shadow-2xl"
                                    width={500}
                                    height={500}
                                />
                            </CardContent>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}
