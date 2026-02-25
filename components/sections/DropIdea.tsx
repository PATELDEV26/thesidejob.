"use client";

import { useEffect, useRef } from "react";
import gsap from "@/lib/gsap";
import Link from "next/link";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

export default function DropIdea() {
    const sectionRef = useRef<HTMLElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLAnchorElement>(null);
    useMagneticEffect(btnRef, 0.2);

    useEffect(() => {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) return;

        const ctx = gsap.context(() => {
            if (boxRef.current) {
                gsap.from(boxRef.current, {
                    y: 60,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: boxRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="drop-idea"
            className="dropidea-section"
            style={{
                background: "#050505",
                padding: "160px 8vw",
                position: "relative",
            }}
        >
            <div style={{ marginBottom: 64, textAlign: "center" }}>
                <div
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: 5,
                        color: "#FF3B30",
                        marginBottom: 24,
                        textTransform: "uppercase",
                    }}
                >
                    [——— SHARE VISION ———]
                </div>
                <h2
                    style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 900,
                        fontSize: "clamp(40px, 5.5vw, 80px)",
                        letterSpacing: "-3px",
                        lineHeight: 1,
                        color: "#fff",
                        marginBottom: 16,
                    }}
                >
                    Got a crazy Idea<span style={{ color: "#FF3B30" }}>?</span>
                </h2>
                <p
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 13,
                        color: "#555",
                        maxWidth: 480,
                        margin: "0 auto",
                        lineHeight: 1.7,
                    }}
                >
                    The best ideas get invited to the Hacker House. Tell us what you want to build and let's make it real.
                </p>
            </div>

            <div
                ref={boxRef}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 40,
                }}
            >
                <Link
                    ref={btnRef}
                    href="/ideas"
                    className="magnetic"
                    style={{
                        display: "inline-block",
                        background: "#FF3B30",
                        color: "#000",
                        fontFamily: "var(--font-syne)",
                        fontWeight: 900,
                        fontSize: 15,
                        letterSpacing: 3,
                        textTransform: "uppercase",
                        padding: "20px 48px",
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                        boxShadow: "0 10px 30px rgba(255, 59, 48, 0.2)",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#cc2f26";
                        e.currentTarget.style.boxShadow = "0 15px 40px rgba(255, 59, 48, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#FF3B30";
                        e.currentTarget.style.boxShadow = "0 10px 30px rgba(255, 59, 48, 0.2)";
                    }}
                >
                    DROP YOUR IDEA →
                </Link>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .dropidea-section {
                        padding: 80px 20px !important;
                    }
                    h2 {
                        font-size: 32px !important;
                        letter-spacing: -1px !important;
                    }
                }
            `}</style>
        </section>
    );
}
