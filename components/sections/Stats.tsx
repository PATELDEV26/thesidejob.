"use client";

import { useEffect, useRef } from "react";
import gsap from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";

const MANIFESTO_LINES = [
    {
        text: "We don\u2019t wait for permission.",
        size: "clamp(28px, 3.5vw, 52px)",
        color: "#333",
        align: "left" as const,
        margin: "0 0 0 8vw",
    },
    {
        text: "We don\u2019t apply to accelerators first.",
        size: "clamp(24px, 3vw, 44px)",
        color: "#444",
        align: "right" as const,
        margin: "0 8vw 0 0",
    },
    {
        text: "We BUILD. Then we get noticed.",
        size: "clamp(32px, 4vw, 60px)",
        color: "#666",
        align: "center" as const,
        margin: "0 auto",
    },
];

export default function Stats() {
    const sectionRef = useRef<HTMLElement>(null);
    const bigTextRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) return;

        const ctx = gsap.context(() => {
            // Background "TSJ" parallax
            if (bigTextRef.current) {
                gsap.to(bigTextRef.current, {
                    rotation: 5,
                    y: -100,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1,
                    },
                });
                gsap.from(bigTextRef.current, { rotation: -5 });
            }

            // Manifesto lines
            gsap.utils.toArray<HTMLElement>(".manifesto-line").forEach((el, i) => {
                gsap.from(el, {
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                    delay: i * 0.2,
                });
            });

            // Final line SLAM
            const finalLine = document.querySelector(".manifesto-final");
            if (finalLine) {
                gsap.from(finalLine, {
                    scale: 1.4,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: finalLine,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                });
            }

            // Red line width
            if (lineRef.current) {
                gsap.from(lineRef.current, {
                    width: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: lineRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                });
            }

            // Tags stagger
            gsap.utils.toArray<HTMLElement>(".manifesto-tag").forEach((tag, i) => {
                gsap.from(tag, {
                    opacity: 0,
                    y: 10,
                    duration: 0.4,
                    delay: 0.6 + i * 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: tag,
                        start: "top 90%",
                        toggleActions: "play none none reverse",
                    },
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="manifesto"
            className="manifesto-section"
            style={{
                minHeight: "100vh",
                background: "#000",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 0",
            }}
        >
            {/* Background "TSJ" text */}
            <div
                ref={bigTextRef}
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontFamily: "var(--font-syne)",
                    fontWeight: 900,
                    fontSize: "clamp(150px, 22vw, 320px)",
                    color: "transparent",
                    WebkitTextStroke: "1px #0f0f0f",
                    pointerEvents: "none",
                    willChange: "transform",
                    lineHeight: 1,
                }}
            >
                TSJ
            </div>

            {/* Foreground content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 32,
                }}
            >
                {MANIFESTO_LINES.map((line) => (
                    <div
                        key={line.text}
                        className="manifesto-line manifesto-text"
                        style={{
                            fontFamily: "var(--font-syne)",
                            fontWeight: 900,
                            fontSize: line.size,
                            color: line.color,
                            textAlign: line.align,
                            margin: line.margin,
                            letterSpacing: "-2px",
                            willChange: "transform, opacity",
                        }}
                    >
                        {line.text}
                    </div>
                ))}

                {/* Final line */}
                <div
                    className="manifesto-final manifesto-final-text"
                    style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 900,
                        fontSize: "clamp(48px, 7vw, 110px)",
                        color: "#fff",
                        textAlign: "center",
                        letterSpacing: "-4px",
                        marginTop: 24,
                        willChange: "transform, opacity",
                    }}
                >
                    THIS IS THESIDEJOB<span style={{ color: "#FF3B30" }}>.</span>
                </div>

                {/* Red line */}
                <div
                    ref={lineRef}
                    style={{
                        width: "100%",
                        height: 1,
                        background: "#FF3B30",
                        margin: "0 auto",
                    }}
                />

                {/* Tags */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 16,
                        flexWrap: "wrap",
                        marginTop: 16,
                    }}
                >
                    {["FOUNDED 2026", "VADODARA, GJ"].map((tag) => (
                        <span
                            key={tag}
                            className="manifesto-tag"
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 10,
                                letterSpacing: 4,
                                color: "#FF3B30",
                                textTransform: "uppercase",
                                border: "1px solid #FF3B30",
                                padding: "8px 16px",
                                willChange: "transform, opacity",
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .manifesto-section {
                        padding: 60px 6vw !important;
                        min-height: auto !important;
                    }
                    .manifesto-text {
                        font-size: clamp(20px, 6vw, 36px) !important;
                        margin: 0 6vw !important;
                        text-align: center !important;
                    }
                    .manifesto-final-text {
                        font-size: clamp(28px, 8vw, 36px) !important;
                        letter-spacing: -1px !important;
                    }
                }
            `}</style>
        </section>
    );
}
