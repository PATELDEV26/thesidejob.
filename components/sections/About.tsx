"use client";

import { useEffect, useRef } from "react";
import gsap from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";

const FOUNDERS = [
    { name: "Dhariya Patel", role: "Co-Founder", initials: "DP", rotate: -3, top: "10%", left: "5%", links: { site: "https://dhairyapatel.vercel.app/", linkedin: "https://www.linkedin.com/in/dhairya-patel-1482122b2" } },
    { name: "Dev Patel", role: "Co-Founder", initials: "DP", rotate: 2, top: "5%", left: "35%", links: { linkedin: "https://www.linkedin.com/in/dev-patel-66363b257/" } },
    { name: "Aditya Gupta", role: "Co-Founder", initials: "AG", rotate: -2, top: "25%", left: "60%", links: { site: "https://adityagupta2005.in", linkedin: "https://www.linkedin.com/in/aditya-gupta-a6196129a" } },
    { name: "Harshit Patel", role: "Co-Founder", initials: "HP", rotate: 3, top: "45%", left: "20%", links: { linkedin: "https://www.linkedin.com/in/harshit-patel-4b71b8371" } },
    { name: "Vansh Kaushal", role: "Co-Founder", initials: "VK", rotate: -1, top: "40%", left: "70%", links: { linkedin: "https://www.linkedin.com/in/vansh-soni-1253762a5/" } },
];

export default function About() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) return;

        // Only use horizontal scroll on desktop
        const mm = gsap.matchMedia();
        const ctx = gsap.context(() => {
            mm.add("(min-width: 769px)", () => {
                if (!innerRef.current || !wrapperRef.current) return;
                const panels = innerRef.current.querySelectorAll(".about-panel");

                gsap.to(innerRef.current, {
                    x: () => -(innerRef.current!.scrollWidth - window.innerWidth),
                    ease: "none",
                    scrollTrigger: {
                        trigger: wrapperRef.current,
                        pin: true,
                        scrub: 1,
                        start: "top top",
                        end: () => `+=${innerRef.current!.scrollWidth - window.innerWidth}`,
                        invalidateOnRefresh: true,
                    },
                });

                // Animate founder cards
                gsap.utils.toArray<HTMLElement>(".founder-card").forEach((card, i) => {
                    gsap.from(card, {
                        rotation: parseFloat(card.dataset.rotate || "0") * 3,
                        opacity: 0,
                        y: 60,
                        scrollTrigger: {
                            trigger: card,
                            containerAnimation: gsap.getById?.("aboutScroll") || undefined,
                            start: "left 80%",
                            toggleActions: "play none none reverse",
                        },
                        duration: 0.8,
                        delay: i * 0.1,
                        ease: "power2.out",
                    });
                });

                // Stat counters
                gsap.utils.toArray<HTMLElement>(".stat-number").forEach((el) => {
                    const target = el.dataset.target || "0";
                    if (target === "∞") return;
                    const counter = { val: 0 };
                    gsap.to(counter, {
                        val: parseInt(target),
                        duration: 1.5,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "left 80%",
                            toggleActions: "play none none reverse",
                        },
                        onUpdate: () => {
                            el.textContent = Math.floor(counter.val).toString();
                        },
                    });
                });
            });

            mm.add("(max-width: 768px)", () => {
                // Founder card animations for mobile
                gsap.utils.toArray<HTMLElement>(".founder-card").forEach((card, i) => {
                    gsap.from(card, {
                        opacity: 0,
                        y: 40,
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            toggleActions: "play none none reverse",
                        },
                        duration: 0.8,
                        delay: i * 0.1,
                        ease: "power2.out",
                    });
                });

                // Stat counters for mobile
                gsap.utils.toArray<HTMLElement>(".stat-number").forEach((el) => {
                    const target = el.dataset.target || "0";
                    if (target === "∞") return;
                    const counter = { val: 0 };
                    gsap.to(counter, {
                        val: parseInt(target),
                        duration: 1.5,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                            toggleActions: "play none none reverse",
                        },
                        onUpdate: () => {
                            el.textContent = Math.floor(counter.val).toString();
                        },
                    });
                });
            });
        });

        return () => {
            ctx.revert();
            mm.revert();
        };
    }, []);

    return (
        <div ref={wrapperRef} id="about" style={{ position: "relative" }}>
            <div
                ref={innerRef}
                className="about-inner"
            >
                {/* Panel 1 — The Origin */}
                <div
                    className="about-panel"
                    style={{
                        flexShrink: 0,
                        background: "#000",
                        position: "relative",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <div
                        className="about-panel-number"
                        style={{
                            position: "absolute",
                            top: "50%",
                            right: -20,
                            transform: "translateY(-50%)",
                            fontFamily: "var(--font-mono)",
                            fontSize: 300,
                            color: "#111",
                            pointerEvents: "none",
                            zIndex: 0,
                            lineHeight: 1,
                        }}
                    >
                        01
                    </div>
                    {/* City skyline */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 200,
                            display: "flex",
                            alignItems: "flex-end",
                            gap: 4,
                            padding: "0 40px",
                            opacity: 0.3,
                        }}
                    >
                        {[120, 80, 160, 60, 200, 100, 140, 70, 180, 90, 110, 150, 65, 130, 85].map((h, i) => (
                            <div
                                key={i}
                                style={{
                                    width: `${6 + Math.random() * 4}%`,
                                    height: h,
                                    background: "#080808",
                                    flexShrink: 0,
                                }}
                            />
                        ))}
                    </div>

                    <div style={{ position: "relative", zIndex: 2 }}>
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
                            [——— ABOUT ———]
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
                            Vadodara&apos;s First
                            <br />
                            Hacker House<span style={{ color: "#FF3B30" }}>.</span>
                        </h2>
                        <p
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 14,
                                lineHeight: 1.8,
                                color: "#555",
                                maxWidth: 480,
                            }}
                        >
                            Born from late-night hackathons and shared dreams, five
                            co-founders built a space where side
                            projects don&apos;t just survive — they become real companies. No
                            gatekeepers. No waiting. Just builders building.
                        </p>
                    </div>
                </div>

                {/* Panel 2 — The Founders */}
                <div
                    className="about-panel"
                    style={{
                        flexShrink: 0,
                        background: "#050505",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <div
                        className="about-panel-number"
                        style={{
                            position: "absolute",
                            top: "50%",
                            right: -20,
                            transform: "translateY(-50%)",
                            fontFamily: "var(--font-mono)",
                            fontSize: 300,
                            color: "#111",
                            pointerEvents: "none",
                            zIndex: 0,
                            lineHeight: 1,
                        }}
                    >
                        02
                    </div>

                    <div style={{ position: "relative", zIndex: 2 }}>
                        <h2
                            style={{
                                fontFamily: "var(--font-syne)",
                                fontWeight: 900,
                                fontSize: "clamp(40px, 5.5vw, 80px)",
                                letterSpacing: "-3px",
                                lineHeight: 1,
                                color: "#fff",
                                marginBottom: 64,
                            }}
                        >
                            The Five<span style={{ color: "#FF3B30" }}>.</span>
                        </h2>
                    </div>

                    <div className="founders-container" style={{ position: "relative", height: "55vh" }}>
                        {FOUNDERS.map((f, i) => (
                            <div
                                key={f.name}
                                className="founder-card"
                                data-rotate={f.rotate}
                                style={{
                                    position: "absolute",
                                    top: f.top,
                                    left: f.left,
                                    background: "#111",
                                    border: "1px solid #1e1e1e",
                                    borderTop: "2px solid #FF3B30",
                                    padding: "20px 24px",
                                    width: 200,
                                    transform: `rotate(${f.rotate}deg)`,
                                    transition: "transform 0.4s ease, box-shadow 0.4s ease",
                                    zIndex: 2 + i,
                                    cursor: "default",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "rotate(0deg) scale(1.05)";
                                    e.currentTarget.style.boxShadow = "0 20px 60px rgba(255,59,48,0.1)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = `rotate(${f.rotate}deg) scale(1)`;
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #FF3B30, #7a0000)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontFamily: "var(--font-syne)",
                                        fontWeight: 900,
                                        fontSize: 14,
                                        color: "#fff",
                                        marginBottom: 12,
                                    }}
                                >
                                    {f.initials}
                                </div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-syne)",
                                        fontWeight: 800,
                                        fontSize: 16,
                                        color: "#fff",
                                        marginBottom: 4,
                                    }}
                                >
                                    {f.name}
                                </div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: 10,
                                        letterSpacing: 2,
                                        color: "#444",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {f.role}
                                </div>
                                <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                                    {f.links && Object.entries(f.links).map(([platform, url]) => (
                                        <a
                                            key={platform}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                fontFamily: "var(--font-mono)",
                                                fontSize: 10,
                                                color: "#666",
                                                textDecoration: "underline",
                                                textTransform: "uppercase",
                                                transition: "color 0.2s"
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = "#FF3B30"}
                                            onMouseLeave={(e) => e.currentTarget.style.color = "#666"}
                                        >
                                            {platform} ↗
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Panel 3 — The Numbers */}
                <div
                    className="about-panel"
                    style={{
                        flexShrink: 0,
                        background: "#000",
                        position: "relative",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <div
                        className="about-panel-number"
                        style={{
                            position: "absolute",
                            top: "50%",
                            right: -20,
                            transform: "translateY(-50%)",
                            fontFamily: "var(--font-mono)",
                            fontSize: 300,
                            color: "#111",
                            pointerEvents: "none",
                            zIndex: 0,
                            lineHeight: 1,
                        }}
                    >
                        03
                    </div>

                    <div
                        style={{
                            position: "relative",
                            zIndex: 2,
                            display: "flex",
                            flexDirection: "column",
                            gap: 0,
                            width: "100%",
                            maxWidth: 600,
                        }}
                    >
                        {[
                            { value: "5", label: "CO-FOUNDERS", target: "5" },
                            { value: "1", label: "HACKER HOUSE", target: "1" },
                            { value: "∞", label: "IDEAS", target: "∞" },
                        ].map((stat, i) => (
                            <div key={stat.label}>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        padding: "40px 0",
                                    }}
                                >
                                    <span
                                        className={`stat-number ${stat.target === "∞" ? "infinity-spin" : ""}`}
                                        data-target={stat.target}
                                        style={{
                                            fontFamily: "var(--font-syne)",
                                            fontWeight: 900,
                                            fontSize: 140,
                                            lineHeight: 1,
                                            color: "#fff",
                                        }}
                                    >
                                        {stat.target === "∞" ? "∞" : "0"}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "var(--font-mono)",
                                            fontSize: 11,
                                            letterSpacing: 4,
                                            color: "#444",
                                            textTransform: "uppercase",
                                            marginTop: 8,
                                        }}
                                    >
                                        {stat.label}
                                    </span>
                                </div>
                                {i < 2 && (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: 1,
                                            background: "#FF3B30",
                                            opacity: 0.3,
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .about-inner {
                    display: flex;
                    flex-direction: row;
                    width: fit-content;
                }
                .about-panel {
                    width: 100vw;
                    height: 100vh;
                    padding: 10vw;
                }
                @media (max-width: 768px) {
                    .about-inner {
                        flex-direction: column;
                        width: 100%;
                    }
                    .about-panel {
                        width: 100%;
                        height: auto;
                        min-height: auto;
                        padding: 40px 20px;
                    }
                    .about-panel-number {
                        display: none;
                    }
                    .founders-container {
                        height: auto !important;
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                    }
                    .founder-card {
                        position: relative !important;
                        top: auto !important;
                        left: auto !important;
                        width: 100% !important;
                        transform: none !important;
                    }
                    .stat-number {
                        font-size: 80px !important;
                    }
                }
            `}</style>
        </div>
    );
}
