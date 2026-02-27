"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";

const PROJECTS = [
    {
        monogram: "V",
        thumbBg: "#1a1f1a",
        tags: "NEXT.JS · WEBSOCKETS · RUST",
        name: "VelocityShare",
        desc: "A next-generation file sharing and collaboration platform built for teams that move fast. Featuring real-time sync and end-to-end encryption.",
        status: "Live" as const,
        hideView: false,
        githubUrl: "https://github.com/thesidejobfive-png/VelociatyShare",
    },
    {
        monogram: "HHI",
        thumbBg: "#1f1a1a",
        tags: "NEXT.JS · NODE.JS · WEBRTC",
        name: "Hacker House India",
        desc: "A groundbreaking hybrid space where India's top developers converge to build, collaborate, and push boundaries.",
        status: "In Development" as const,
        hideView: true,
    },
];

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!cardRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from(cardRef.current, {
                y: 60,
                opacity: 0,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top 90%",
                },
                delay: index * 0.15,
            });
        });
        return () => ctx.revert();
    }, [index]);

    const cardContent = (
        <div
            ref={cardRef}
            style={{
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                background: "#0d0d0d",
                border: `1px solid ${isHovered ? "rgba(255,59,48,0.3)" : "#111"}`,
                transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: isHovered ? "0 20px 60px rgba(0,0,0,0.5)" : "none",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Thumbnail */}
            <div
                style={{
                    height: 340,
                    background: isHovered
                        ? `color-mix(in srgb, ${project.thumbBg} 85%, #222)`
                        : project.thumbBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    transition: "background 0.4s ease",
                }}
            >
                <span
                    style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 900,
                        fontSize: 80,
                        color: `rgba(255,255,255,${isHovered ? 0.12 : 0.06})`,
                        letterSpacing: -4,
                        transition: "color 0.4s ease",
                        userSelect: "none",
                    }}
                >
                    {project.monogram}
                </span>
                {/* Red overlay on hover */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "30%",
                        background: "linear-gradient(to top, rgba(255,59,48,0.15), transparent)",
                        clipPath: isHovered ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)",
                        transition: "clip-path 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    }}
                />
            </div>

            {/* Card Bottom */}
            <div style={{ padding: "24px 28px" }}>
                {/* Tags */}
                <div
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        color: "#FF3B30",
                    }}
                >
                    {project.tags}
                </div>

                {/* Name */}
                <div
                    style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 800,
                        fontSize: 24,
                        color: "#fff",
                        marginTop: 8,
                    }}
                >
                    {project.name}
                </div>

                {/* Description */}
                <div
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "#555",
                        lineHeight: 1.7,
                        marginTop: 8,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {project.desc}
                </div>

                {/* Bottom row */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 20,
                    }}
                >
                    {/* Status */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: project.status === "Live" ? "#32D74B" : "#FFD60A",
                            }}
                        />
                        <span
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 10,
                                color: project.status === "Live" ? "#32D74B" : "#FFD60A",
                            }}
                        >
                            {project.status}
                        </span>
                    </div>

                    {/* View link */}
                    {!project.hideView && project.githubUrl ? (
                        <span
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 11,
                                color: "#FF3B30",
                                transition: "color 0.3s ease",
                            }}
                        >
                            View on GitHub ↗
                        </span>
                    ) : !project.hideView && (
                        <span
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 12,
                                color: isHovered ? "#FF3B30" : "#555",
                                transition: "color 0.3s ease",
                            }}
                        >
                            View →
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    if (project.githubUrl) {
        return (
            <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
            >
                {cardContent}
            </a>
        );
    }

    return cardContent;
}

export default function OurWork() {
    const sectionRef = useRef<HTMLElement>(null);
    const headlineRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Headline clip in
            if (headlineRef.current) {
                const inner = headlineRef.current.querySelector(".work-headline-inner");
                if (inner) {
                    gsap.from(inner, {
                        y: "110%",
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: headlineRef.current,
                            start: "top 85%",
                        },
                    });
                }
            }

            // Red line draws in
            if (lineRef.current) {
                gsap.from(lineRef.current, {
                    scaleX: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: lineRef.current,
                        start: "top 90%",
                    },
                });
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="work"
            className="work-section"
            style={{
                background: "#000",
                padding: "140px 8vw",
            }}
        >
            {/* Eyebrow */}
            <div
                style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: "#FF3B30",
                    marginBottom: 24,
                }}
            >
                {`// 02`}
            </div>

            {/* Headline */}
            <div ref={headlineRef} style={{ overflow: "hidden", marginBottom: 80 }}>
                <div
                    className="work-headline-inner"
                    style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 900,
                        fontSize: "clamp(64px, 9vw, 130px)",
                        letterSpacing: -4,
                        color: "#fff",
                    }}
                >
                    Our Work
                </div>
            </div>

            {/* Project Grid */}
            <div
                className="work-grid"
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 24,
                }}
            >
                {PROJECTS.map((project, i) => (
                    <ProjectCard key={project.name} project={project} index={i} />
                ))}
            </div>

            {/* Bottom text */}
            <div
                style={{
                    marginTop: 64,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                }}
            >
                <div
                    ref={lineRef}
                    style={{
                        width: 120,
                        height: 1,
                        background: "#FF3B30",
                        transformOrigin: "center",
                    }}
                />
                <span
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 13,
                        color: "#333",
                        letterSpacing: 2,
                    }}
                >
                    More projects coming soon. We build fast.
                </span>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .work-section {
                        padding: 80px 6vw !important;
                    }
                    .work-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </section>
    );
}
