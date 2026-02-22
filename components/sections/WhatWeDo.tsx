"use client";

import { useEffect, useRef } from "react";
import gsap from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";

const SERVICES = [
    {
        num: "01",
        title: "BUILD",
        desc: "From zero to MVP in weeks, not months. We build real products with real users — not class assignments that collect dust. Next.js, React, Node, Python, whatever the stack demands.",
        tags: ["NEXT.JS", "REACT", "TYPESCRIPT", "NODE.JS", "PYTHON"],
        direction: "left" as const,
        mockup: "code" as const,
    },
    {
        num: "02",
        title: "HACK",
        desc: "Hackathons aren't events — they're a lifestyle. We break things, rebuild them better, and push boundaries. Every weekend is a chance to prototype something dangerous.",
        tags: ["HACKATHONS", "RAPID PROTOTYPING", "AI/ML", "WEB3"],
        direction: "right" as const,
        mockup: "terminal" as const,
    },
    {
        num: "03",
        title: "LAUNCH",
        desc: "Ideas are cheap. Execution is everything. We ship products, acquire users, pitch investors, and build companies that matter. From dorm room to launch day.",
        tags: ["PRODUCT HUNT", "INVESTOR PITCH", "GTM STRATEGY", "GROWTH"],
        direction: "left" as const,
        mockup: "rocket" as const,
    },
];

function CodeMockup() {
    const codeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!codeRef.current) return;
        const lines = [
            '<span style="color:#569CD6">export default</span> <span style="color:#DCDCAA">function</span> <span style="color:#4EC9B0">StartupApp</span>() {',
            '  <span style="color:#569CD6">const</span> [<span style="color:#9CDCFE">launched</span>, <span style="color:#9CDCFE">setLaunched</span>] = <span style="color:#DCDCAA">useState</span>(<span style="color:#569CD6">false</span>);',
            "",
            '  <span style="color:#569CD6">return</span> (',
            '    &lt;<span style="color:#4EC9B0">div</span> <span style="color:#9CDCFE">className</span>=<span style="color:#CE9178">"hacker-house"</span>&gt;',
            '      &lt;<span style="color:#4EC9B0">h1</span>&gt;<span style="color:#CE9178">Ship it.</span>&lt;/<span style="color:#4EC9B0">h1</span>&gt;',
            '      &lt;<span style="color:#4EC9B0">Button</span> <span style="color:#9CDCFE">onClick</span>={() =&gt; <span style="color:#DCDCAA">setLaunched</span>(<span style="color:#569CD6">true</span>)}&gt;',
            '        <span style="color:#CE9178">🚀 Launch</span>',
            '      &lt;/<span style="color:#4EC9B0">Button</span>&gt;',
            '    &lt;/<span style="color:#4EC9B0">div</span>&gt;',
            "  );",
            "}",
        ];

        let currentLine = 0;
        let currentChar = 0;
        let interval: ReturnType<typeof setInterval>;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: codeRef.current,
                start: "top 80%",
                onEnter: () => {
                    if (codeRef.current) codeRef.current.innerHTML = "";
                    interval = setInterval(() => {
                        if (currentLine >= lines.length) {
                            clearInterval(interval);
                            return;
                        }
                        if (codeRef.current) {
                            codeRef.current.innerHTML =
                                lines.slice(0, currentLine).join("<br/>") +
                                (currentLine < lines.length
                                    ? "<br/>" +
                                    lines[currentLine].slice(
                                        0,
                                        currentChar
                                    )
                                    : "");
                            codeRef.current.innerHTML += '<span class="term-cursor" style="color:#FF3B30">▊</span>';
                        }
                        currentChar++;
                        const rawLen = lines[currentLine]?.replace(/<[^>]*>/g, "").length || 0;
                        if (currentChar > rawLen) {
                            currentLine++;
                            currentChar = 0;
                        }
                    }, 20);
                },
            });
        });

        return () => {
            ctx.revert();
            clearInterval(interval);
        };
    }, []);

    return (
        <div
            style={{
                background: "#1a1a1a",
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid #222",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 16px",
                    background: "#161616",
                    borderBottom: "1px solid #222",
                }}
            >
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF3B30" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFD60A" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#32D74B" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#444", marginLeft: 8 }}>
                    index.tsx
                </span>
            </div>
            <div
                ref={codeRef}
                style={{
                    padding: 20,
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    lineHeight: 1.8,
                    color: "#d4d4d4",
                    minHeight: 280,
                }}
            />
        </div>
    );
}

function TerminalMockup() {
    return (
        <div
            style={{
                background: "#1a1a1a",
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid #222",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 16px",
                    background: "#161616",
                    borderBottom: "1px solid #222",
                }}
            >
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF3B30" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFD60A" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#32D74B" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#444", marginLeft: 8 }}>
                    hack — zsh
                </span>
            </div>
            <div
                style={{
                    padding: 20,
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    lineHeight: 2,
                    minHeight: 280,
                }}
            >
                <div style={{ color: "#fff" }}>$ npm run hack --mode=beast</div>
                <div style={{ color: "#32D74B" }}>&gt; Initializing hack mode... 🔥</div>
                <div style={{ color: "#fff" }}>$ deploy --target=production</div>
                <div style={{ color: "#32D74B" }}>&gt; Deployed in 2.1s ✓</div>
                <div style={{ color: "#fff" }}>$ users --count</div>
                <div style={{ color: "#FFD60A" }}>&gt; 1,247 active users 📈</div>
                <div style={{ color: "#fff" }}>$ coffee --refill</div>
                <div style={{ color: "#32D74B" }}>&gt; ☕ Ready. Let&apos;s go.</div>
            </div>
        </div>
    );
}

function RocketSVG() {
    const pathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (pathRef.current) {
                const length = pathRef.current.getTotalLength();
                gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
                gsap.to(pathRef.current, {
                    strokeDashoffset: 0,
                    duration: 1.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: pathRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                });
            }
        });
        return () => ctx.revert();
    }, []);

    return (
        <svg width="200" height="280" viewBox="0 0 200 280" fill="none">
            <path
                ref={pathRef}
                d="M100 260 L100 40 L80 80 M100 40 L120 80 M70 120 L130 120 M60 180 L140 180 M80 220 L120 220"
                stroke="#FF3B30"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function WhatWeDo() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) return;

        const ctx = gsap.context(() => {
            gsap.utils.toArray<HTMLElement>(".wwd-block").forEach((block) => {
                const dir = block.dataset.dir === "right" ? 80 : -80;
                gsap.from(block, {
                    x: dir,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: block,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                });
            });

            // Underline draw
            const underline = document.querySelector(".wwd-underline") as SVGPathElement;
            if (underline) {
                const len = underline.getTotalLength();
                gsap.set(underline, { strokeDasharray: len, strokeDashoffset: len });
                gsap.to(underline, {
                    strokeDashoffset: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
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
            id="what-we-do"
            style={{ background: "#050505", padding: "160px 8vw" }}
        >
            {/* Header */}
            <div style={{ marginBottom: 80 }}>
                <h2
                    style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 900,
                        fontSize: "clamp(48px, 6vw, 96px)",
                        letterSpacing: "-3px",
                        lineHeight: 0.95,
                        color: "#fff",
                    }}
                >
                    What We
                    <br />
                    <span style={{ position: "relative", display: "inline-block" }}>
                        Build<span style={{ color: "#FF3B30" }}>.</span>
                        <svg
                            style={{ position: "absolute", bottom: -10, left: 0, width: "100%" }}
                            viewBox="0 0 200 12"
                            fill="none"
                            preserveAspectRatio="none"
                        >
                            <path
                                className="wwd-underline"
                                d="M0 6 Q50 0, 100 6 T200 6"
                                stroke="#FF3B30"
                                strokeWidth="2"
                                fill="none"
                            />
                        </svg>
                    </span>
                </h2>
            </div>

            {/* Service blocks */}
            {SERVICES.map((s, i) => (
                <div
                    key={s.num}
                    className="wwd-block"
                    data-dir={s.direction}
                    style={{
                        display: "grid",
                        gap: 80,
                        alignItems: "center",
                        padding: "56px 0",
                        borderTop: "1px solid #1a1a1a",
                        transition: "background 0.3s ease",
                        willChange: "transform, opacity",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                    {s.direction === "left" ? (
                        <>
                            <div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: 11,
                                        letterSpacing: 3,
                                        color: "#222",
                                        marginBottom: 12,
                                    }}
                                >
                                    {s.num}
                                </div>
                                <h3
                                    className="wwd-title"
                                    style={{
                                        fontFamily: "var(--font-syne)",
                                        fontWeight: 900,
                                        fontSize: 56,
                                        color: "#fff",
                                        marginBottom: 16,
                                        letterSpacing: "-2px",
                                    }}
                                >
                                    {s.title}
                                    <span style={{ color: "#FF3B30" }}>.</span>
                                </h3>
                                <p
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: 14,
                                        lineHeight: 1.8,
                                        color: "#555",
                                        marginBottom: 24,
                                        maxWidth: 420,
                                    }}
                                >
                                    {s.desc}
                                </p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {s.tags.map((t) => (
                                        <span
                                            key={t}
                                            style={{
                                                fontFamily: "var(--font-mono)",
                                                fontSize: 10,
                                                letterSpacing: 2,
                                                color: "#444",
                                                border: "1px solid #222",
                                                padding: "6px 12px",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                {s.mockup === "code" && <CodeMockup />}
                                {s.mockup === "rocket" && (
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <RocketSVG />
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                {s.mockup === "terminal" && <TerminalMockup />}
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: 11,
                                        letterSpacing: 3,
                                        color: "#222",
                                        marginBottom: 12,
                                    }}
                                >
                                    {s.num}
                                </div>
                                <h3
                                    className="wwd-title"
                                    style={{
                                        fontFamily: "var(--font-syne)",
                                        fontWeight: 900,
                                        fontSize: 56,
                                        color: "#fff",
                                        marginBottom: 16,
                                        letterSpacing: "-2px",
                                    }}
                                >
                                    {s.title}
                                    <span style={{ color: "#FF3B30" }}>.</span>
                                </h3>
                                <p
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: 14,
                                        lineHeight: 1.8,
                                        color: "#555",
                                        marginBottom: 24,
                                        maxWidth: 420,
                                    }}
                                >
                                    {s.desc}
                                </p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {s.tags.map((t) => (
                                        <span
                                            key={t}
                                            style={{
                                                fontFamily: "var(--font-mono)",
                                                fontSize: 10,
                                                letterSpacing: 2,
                                                color: "#444",
                                                border: "1px solid #222",
                                                padding: "6px 12px",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ))}

            <style jsx>{`
                .wwd-block {
                    grid-template-columns: 1fr 1fr;
                }
                @media (max-width: 768px) {
                    .wwd-block {
                        grid-template-columns: 1fr !important;
                        gap: 40px !important;
                    }
                    .wwd-title {
                        font-size: 40px !important;
                    }
                }
            `}</style>
        </section>
    );
}
