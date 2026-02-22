"use client";

import { useEffect, RefObject } from "react";
import gsap from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";

interface UseScrollTriggerOptions {
    trigger: RefObject<HTMLElement>;
    start?: string;
    end?: string;
    scrub?: boolean | number;
    pin?: boolean;
    toggleActions?: string;
    onEnter?: () => void;
    onLeave?: () => void;
    onUpdate?: (self: ScrollTrigger) => void;
}

export function useScrollTrigger(options: UseScrollTriggerOptions) {
    useEffect(() => {
        if (!options.trigger.current) return;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: options.trigger.current!,
                start: options.start || "top 85%",
                end: options.end,
                scrub: options.scrub,
                pin: options.pin,
                toggleActions: options.toggleActions || "play none none reverse",
                onEnter: options.onEnter,
                onLeave: options.onLeave,
                onUpdate: options.onUpdate,
            });
        });

        return () => ctx.revert();
    }, []);
}
