"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "@/lib/gsap";

export default function PageLoader() {
    const loaderRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const [done, setDone] = useState(false);

    useEffect(() => {
        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReduced) {
            setDone(true);
            return;
        }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Split text manually
            if (textRef.current) {
                const text = "Thesidejob";
                textRef.current.innerHTML = text
                    .split("")
                    .map(
                        (char, i) =>
                            `<span style="display:inline-block;opacity:0;transform:translateY(20px)" class="loader-char">${char}</span>`
                    )
                    .join("") + '<span style="color:#FF3B30;display:inline-block;opacity:0;transform:translateY(20px)" class="loader-char">.</span>';

                tl.to(".loader-char", {
                    opacity: 1,
                    y: 0,
                    stagger: 0.05,
                    duration: 0.4,
                    ease: "power2.out",
                });
            }

            // Loading bar
            tl.to(
                barRef.current,
                {
                    width: "100%",
                    duration: 1.8,
                    ease: "power2.inOut",
                },
                0
            );

            // Counter
            const counter = { val: 0 };
            tl.to(
                counter,
                {
                    val: 100,
                    duration: 1.8,
                    ease: "power2.inOut",
                    onUpdate: () => {
                        if (counterRef.current) {
                            counterRef.current.textContent = Math.floor(counter.val)
                                .toString()
                                .padStart(3, "0");
                        }
                    },
                },
                0
            );

            // Slide away
            tl.to(
                loaderRef.current,
                {
                    clipPath: "inset(0 0 100% 0)",
                    duration: 0.8,
                    ease: "power3.inOut",
                    delay: 0.4,
                    onComplete: () => setDone(true),
                },
                "+=0.2"
            );
        });

        return () => ctx.revert();
    }, []);

    if (done) return null;

    return (
        <div
            ref={loaderRef}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 10000,
                background: "#000",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                clipPath: "inset(0 0 0% 0)",
            }}
        >
            <div
                ref={textRef}
                style={{
                    fontFamily: "var(--font-syne)",
                    fontWeight: 900,
                    fontSize: "clamp(32px, 5vw, 56px)",
                    letterSpacing: "-2px",
                    color: "#fff",
                }}
            />

            <div
                style={{
                    width: 200,
                    height: 1,
                    background: "rgba(255,255,255,0.1)",
                    marginTop: 32,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div
                    ref={barRef}
                    style={{
                        width: 0,
                        height: "100%",
                        background: "#FF3B30",
                    }}
                />
            </div>

            <span
                ref={counterRef}
                style={{
                    position: "absolute",
                    bottom: 48,
                    right: 48,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    letterSpacing: 3,
                    color: "#333",
                }}
            >
                000
            </span>
        </div>
    );
}
