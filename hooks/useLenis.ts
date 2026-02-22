"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";

export function useLenis() {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const lenis = new Lenis({
            lerp: prefersReduced ? 1 : 0.08,
            duration: prefersReduced ? 0 : 1.2,
            smoothWheel: true,
        });

        lenisRef.current = lenis;
        (window as any).__lenis = lenis;

        lenis.on("scroll", ScrollTrigger.update);

        const tickerCallback = (time: number) => {
            lenis.raf(time * 1000);
        };
        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(tickerCallback);
            lenis.destroy();
            lenisRef.current = null;
            (window as any).__lenis = null;
        };
    }, []);

    return lenisRef;
}
