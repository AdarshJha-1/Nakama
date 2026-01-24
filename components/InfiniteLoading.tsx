"use client"

import React from "react"
import { useInView } from "react-intersection-observer"

interface InfiniteLoadingProps extends React.PropsWithChildren {
    onBottomReached: () => void;
    className?: string;
}

export default function InfiniteLoading({ className, children, onBottomReached }: InfiniteLoadingProps) {

    const { ref } = useInView({
        rootMargin: "200px",
        onChange(inView) {
            if (inView) {
                onBottomReached()
            }
        },
    })


    return (
        <div className={className}>
            {children}
            <div ref={ref} className=""></div>
        </div>
    )
}
