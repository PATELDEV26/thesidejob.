"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";

const TIMELINE_ITEMS = [
    { time: "23:47", text: "Someone ships a feature. Slack goes 🚀" },
    { time: "02:13", text: "Another all-nighter. Bad Wi-Fi, great ideas." },
    { time: "08:00", text: "Stand-up. 3 people. 12 ideas. Let's go." },
    { time: "14:30", text: "Investor call practice in the living room." },
    { time: "19:00", text: "Code review over chai. ☕" },
];

const TERMINAL_LINES = [
    { text: "$ git commit -m 'ship it'", color: "#fff" },
    { text: "> Committed. 🚀", color: "#32D74B" },
    { text: "$ npm run build", color: "#fff" },
    { text: "> Build successful in 2.3s", color: "#32D74B" },
    { text: "$ idea --validate 'AI for students'", color: "#fff" },
    { text: "> Market size: 4.2B 👀", color: "#FFD60A" },
    { text: "$ co-founders --status", color: "#fff" },
    { text: "> All 5 online. Let's go.", color: "#32D74B" },
];

function Terminal() {
    const [lines, setLines] = useState<typeof TERMINAL_LINES>([]);
    const bodyRef = useRef<HTMLDivElement>(null);
    const indexRef = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setLines((prev) => {
                const next = [...prev, TERMINAL_LINES[indexRef.current % TERMINAL_LINES.length]];
                indexRef.current++;
                // Keep last 12 lines
                return next.slice(-12);
            });
        }, 1200);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [lines]);

    return (
        <div
            style={{
                background: "#0d0d0d",
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid #1e1e1e",
            }}
        >
            {/* Title bar */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 16px",
                    background: "#1a1a1a",
                    borderBottom: "1px solid #1e1e1e",
                }}
            >
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF3B30" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFD60A" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#32D74B" }} />
                <span
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "#444",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    thesidejob — zsh
                </span>
            </div>
            {/* Body */}
            <div
                ref={bodyRef}
                style={{
                    padding: 24,
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    lineHeight: 2,
                    height: 360,
                    overflowY: "auto",
                }}
            >
                {lines.map((line, i) => (
                    <div key={i} style={{ color: line.color }}>
                        {line.text}
                    </div>
                ))}
                <span className="term-cursor" style={{ color: "#FF3B30" }}>
                    ▊
                </span>
            </div>
        </div>
    );
}

export default function HackerHouse() {
    const sectionRef = useRef<HTMLElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) return;

        const ctx = gsap.context(() => {
            gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item, i) => {
                gsap.from(item, {
                    opacity: 0,
                    x: -20,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                    delay: i * 0.1,
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="hacker-house"
            style={{
                background: "#000",
                padding: "160px 8vw",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background grid */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `
            linear-gradient(rgba(255,59,48,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,59,48,0.03) 1px, transparent 1px)
          `,
                    backgroundSize: "40px 40px",
                    opacity: 0.5,
                    transform: "perspective(800px) rotateX(20deg)",
                    transformOrigin: "50% 0%",
                    pointerEvents: "none",
                }}
            />

            <div
                className="hh-grid"
                style={{
                    position: "relative",
                    zIndex: 2,
                }}
            >
                {/* Left column */}
                <div>
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
                        [——— HACKER HOUSE ———]
                    </div>
                    <h2
                        style={{
                            fontFamily: "var(--font-syne)",
                            fontWeight: 900,
                            fontSize: "clamp(40px, 5.5vw, 80px)",
                            letterSpacing: "-3px",
                            lineHeight: 1,
                            color: "#fff",
                            marginBottom: 24,
                        }}
                    >
                        Life Inside
                        <br />
                        Thesidejob<span style={{ color: "#FF3B30" }}>.</span>
                    </h2>
                    <p
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 14,
                            lineHeight: 1.8,
                            color: "#555",
                            marginBottom: 48,
                            maxWidth: 420,
                        }}
                    >
                        Late nights. Fast shipping. Big ideas. This is where builders live.
                    </p>

                    {/* Timeline */}
                    <div ref={timelineRef} style={{ position: "relative", paddingLeft: 24 }}>
                        {/* Vertical line */}
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: 1,
                                height: "100%",
                                background: "rgba(255,59,48,0.2)",
                            }}
                        />
                        {TIMELINE_ITEMS.map((item) => (
                            <div
                                key={item.time}
                                className="timeline-item"
                                style={{
                                    display: "flex",
                                    gap: 24,
                                    marginBottom: 32,
                                    alignItems: "flex-start",
                                    willChange: "transform, opacity",
                                }}
                            >
                                {/* Dot */}
                                <div
                                    style={{
                                        position: "absolute",
                                        left: -3,
                                        width: 7,
                                        height: 7,
                                        borderRadius: "50%",
                                        background: "#FF3B30",
                                        marginTop: 4,
                                    }}
                                />
                                <span
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: 12,
                                        color: "#FF3B30",
                                        flexShrink: 0,
                                        width: 50,
                                    }}
                                >
                                    {item.time}
                                </span>
                                <span
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: 13,
                                        color: "#888",
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right column — Terminal */}
                <div className="hh-terminal">
                    <Terminal />
                </div>
            </div>

            <style jsx>{`
                .hh-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 80px;
                }
                .hh-terminal {
                    position: sticky;
                    top: 120px;
                    align-self: start;
                }
                @media (max-width: 768px) {
                    .hh-grid {
                        grid-template-columns: 1fr;
                        gap: 48px;
                    }
                    .hh-terminal {
                        position: relative;
                        top: auto;
                    }
                }
            `}</style>
        </section>
    );
}
