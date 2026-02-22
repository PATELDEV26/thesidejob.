"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ParticleField = dynamic(
    () => import("@/components/three/ParticleField"),
    { ssr: false }
);

interface TerminalLine {
    text: string;
    color: string;
    prefix?: string;
    prefixColor?: string;
}

const TERMINAL_LINES: TerminalLine[] = [
    { text: "init project", color: "#FF3B30", prefix: "tsj >", prefixColor: "#FF3B30" },
    { text: "> Loading team...", color: "#555" },
    { text: "✓ Designers: ready", color: "#32D74B" },
    { text: "✓ Developers: ready", color: "#32D74B" },
    { text: "✓ Strategy: ready", color: "#32D74B" },
    { text: "Building Vadodara's First Hacker House ", color: "#FF3B30" },

];

function HeroTerminal() {
    const [visibleLines, setVisibleLines] = useState(0);

    useEffect(() => {
        const delays = [600, 1200, 1800, 2200, 2600, 3200, 4200];
        const timers: NodeJS.Timeout[] = [];
        delays.forEach((ms, i) => {
            timers.push(setTimeout(() => setVisibleLines(i + 1), ms));
        });
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div
            style={{
                width: "100%",
                maxWidth: 500,
                background: "rgba(20,20,20,0.85)",
                border: "1px solid #222",
                borderRadius: 10,
                overflow: "hidden",
                opacity: 0,
                animation: "heroFadeUp 0.8s ease forwards",
                animationDelay: "0.6s",
            }}
        >
            {/* Title bar */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 16px",
                    borderBottom: "1px solid #222",
                }}
            >
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
                <span
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "#555",
                        marginLeft: 8,
                    }}
                >
                    thesidejob.co — zsh
                </span>
            </div>
            {/* Terminal body */}
            <div style={{ padding: "16px 20px", minHeight: 200 }}>
                {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => {
                    const isLast = i === TERMINAL_LINES.length - 1;
                    return (
                        <div
                            key={i}
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 13,
                                lineHeight: 2,
                                color: line.color,
                                whiteSpace: "nowrap",
                                ...(isLast
                                    ? {
                                        fontWeight: "bold",
                                        letterSpacing: 2,
                                        marginTop: 4,
                                    }
                                    : {}),
                            }}
                        >
                            {line.prefix && (
                                <span style={{ color: line.prefixColor, marginRight: 8 }}>
                                    {line.prefix}
                                </span>
                            )}
                            {line.text}
                        </div>
                    );
                })}
                {/* Blinking cursor */}
                <span
                    style={{
                        display: "inline-block",
                        width: 8,
                        height: 16,
                        background: "#FF3B30",
                        marginTop: 4,
                        animation: "termBlink 1s step-end infinite",
                    }}
                />
            </div>
        </div>
    );
}

export default function Hero() {
    return (
        <section
            id="hero"
            style={{
                position: "relative",
                minHeight: "100vh",
                height: "auto",
                overflow: "visible",
                background: "#000",
            }}
        >
            {/* Keyframe definitions */}
            <style>{`
                @keyframes heroFadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(24px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes heroBounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(8px);
                    }
                }
                @keyframes termBlink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                @media (max-width: 900px) {
                    .hero-grid {
                        grid-template-columns: 1fr !important;
                        min-height: 100vh !important;
                        padding: 120px 24px 60px !important;
                        gap: 20px !important;
                    }
                    .hero-terminal-col {
                        display: none !important;
                    }
                }
                @media (max-width: 480px) {
                    .hero-grid {
                        padding: 100px 20px 40px !important;
                    }
                }
            `}</style>

            {/* WebGL Particles */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            >
                <ParticleField />
            </div>

            {/* Two-column grid content */}
            <div
                className="hero-grid"
                style={{
                    position: "relative",
                    zIndex: 2,
                    display: "grid",
                    gridTemplateColumns: "55% 45%",
                    alignItems: "flex-start",
                    minHeight: "100vh",
                    padding: "100px 0 60px 6vw",
                    gap: 40,
                }}
            >
                {/* Left column — headline, paragraph, buttons */}
                <div>
                    {/* Headline */}
                    <div>
                        {[
                            { word: "We", delay: "0.3s" },
                            { word: "Build", delay: "0.42s" },
                            { word: "What", delay: "0.54s" },
                            { word: "Others", delay: "0.66s" },
                            { word: "Dream.", delay: "0.78s" },
                        ].map(({ word, delay }) => (
                            <div
                                key={word}
                                style={{
                                    fontFamily: "var(--font-syne)",
                                    fontWeight: 900,
                                    fontSize: "clamp(72px, 11vw, 160px)",
                                    letterSpacing: -4,
                                    lineHeight: 0.88,
                                    color: "#fff",
                                    display: "block",
                                    margin: 0,
                                    padding: 0,
                                    opacity: 0,
                                    animation: "heroFadeUp 0.7s ease forwards",
                                    animationDelay: delay,
                                }}
                            >
                                {word === "Dream." ? (
                                    <>
                                        Dream
                                        <span style={{ color: "#FF3B30" }}>.</span>
                                    </>
                                ) : (
                                    word
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Paragraph */}
                    <div
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 13,
                            color: "#555555",
                            lineHeight: 1.8,
                            maxWidth: 460,
                            marginTop: 20,
                            opacity: 0,
                            animation: "heroFadeUp 0.6s ease forwards",
                            animationDelay: "1s",
                        }}
                    >
                        A collective of designers, engineers, and dreamers crafting
                        premium digital products.
                    </div>

                    {/* Buttons */}
                    <div
                        style={{
                            display: "flex",
                            gap: 16,
                            marginTop: 28,
                            opacity: 0,
                            animation: "heroFadeUp 0.6s ease forwards",
                            animationDelay: "1.2s",
                        }}
                    >
                        <a
                            href="#our-work"
                            style={{
                                background: "#FF3B30",
                                color: "#000",
                                fontFamily: "var(--font-syne)",
                                fontWeight: 900,
                                fontSize: 14,
                                padding: "16px 28px",
                                border: "none",
                                borderRadius: 999,
                                cursor: "pointer",
                                textDecoration: "none",
                                display: "inline-block",
                            }}
                        >
                            See Our Work →
                        </a>
                        <a
                            href="#services"
                            className="hero-secondary-btn"
                            style={{
                                background: "transparent",
                                color: "#fff",
                                fontFamily: "var(--font-syne)",
                                fontWeight: 700,
                                fontSize: 14,
                                padding: "16px 28px",
                                border: "1px solid #333",
                                borderRadius: 999,
                                cursor: "pointer",
                                textDecoration: "none",
                                display: "inline-block",
                                transition: "border-color 0.3s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#fff";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "#333";
                            }}
                        >
                            How We Work
                        </a>
                    </div>
                </div>

                {/* Right column — Terminal */}
                <div
                    className="hero-terminal-col"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        paddingRight: "4vw",
                        position: "sticky",
                        top: 120,
                    }}
                >
                    <HeroTerminal />
                </div>
            </div>

            {/* Scroll indicator */}
            <div
                style={{
                    position: "absolute",
                    bottom: 40,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    zIndex: 3,
                    opacity: 0,
                    animation: "heroFadeUp 0.6s ease forwards",
                    animationDelay: "1.5s",
                }}
            >
                <div
                    style={{
                        color: "#333",
                        fontSize: 20,
                        animation: "heroBounce 2s ease-in-out infinite",
                    }}
                >
                    ↓
                </div>
            </div>
        </section>
    );
}
