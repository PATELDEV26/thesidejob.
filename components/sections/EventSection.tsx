"use client";

import { useEffect, useRef } from "react";
import gsap from "@/lib/gsap";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

export default function EventSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const applyBtnRef = useRef<HTMLAnchorElement>(null);

    useMagneticEffect(applyBtnRef, 0.2);

    useEffect(() => {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) return;

        const ctx = gsap.context(() => {
            if (contentRef.current) {
                gsap.from(contentRef.current, {
                    y: 60,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: contentRef.current,
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
            id="event"
            className="event-section"
            style={{
                background: "#050505",
                padding: "160px 8vw",
                position: "relative",
                borderTop: "1px solid #1a1a1a",
                borderBottom: "1px solid #1a1a1a",
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
                    [——— COMMUNITY EVENT ———]
                </div>
                <h2
                    style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 900,
                        fontSize: "clamp(32px, 4.5vw, 64px)",
                        letterSpacing: "-2px",
                        lineHeight: 1.1,
                        color: "#fff",
                        marginBottom: 16,
                    }}
                >
                    Portfolio Competition<span style={{ color: "#FF3B30" }}>.</span>
                </h2>
                <p
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 14,
                        color: "#aaa",
                        maxWidth: 600,
                        margin: "0 auto",
                        lineHeight: 1.6,
                    }}
                >
                    Build a clean and creative personal portfolio website that showcases your skills, projects, and personality as a developer.
                </p>
            </div>

            <div
                ref={contentRef}
                style={{
                    background: "#0a0a0a",
                    border: "1px solid #1a1a1a",
                    padding: "clamp(32px, 5vw, 48px)",
                    maxWidth: 800,
                    margin: "0 auto",
                    position: "relative",
                }}
            >
                {/* Accent corners */}
                <div style={{ position: "absolute", top: 0, left: 0, width: 24, height: 2, background: "#FF3B30" }} />
                <div style={{ position: "absolute", top: 0, left: 0, width: 2, height: 24, background: "#FF3B30" }} />
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 2, background: "#FF3B30" }} />
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 2, height: 24, background: "#FF3B30" }} />
                
                <div style={{ display: "grid", gap: "32px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                    
                    {/* Left Column */}
                    <div>
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, color: "#FF3B30", textTransform: "uppercase", marginBottom: 8 }}>Prize Pool</div>
                            <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 36, color: "#fff" }}>₹1000</div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#555", marginTop: 4 }}>(Bohot saara paisa)</div>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, color: "#FF3B30", textTransform: "uppercase", marginBottom: 8 }}>Timeline</div>
                            <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 20, color: "#fff" }}>Deadline: This Sunday</div>
                            <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 20, color: "#fff", marginTop: 4 }}>Results: Monday</div>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, color: "#FF3B30", textTransform: "uppercase", marginBottom: 8 }}>Rules & Details</div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#ddd", lineHeight: 1.5 }}>
                                Participants are free to use any tech stack, any AI logic, and deploy on any platform. Keep it unique and clean!
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, color: "#FF3B30", textTransform: "uppercase", marginBottom: 12 }}>Judging Criteria</div>
                            <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                                {["Design and visual aesthetics", "Responsiveness", "Functionality and interactivity", "Content and personal branding", "Creativity and originality"].map((item, i) => (
                                    <li key={i} style={{ 
                                        fontFamily: "var(--font-mono)", 
                                        fontSize: 13, 
                                        color: "#ddd", 
                                        marginBottom: 10,
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 8
                                    }}>
                                        <span style={{ color: "#FF3B30", fontSize: 12, marginTop: 2 }}>→</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2, color: "#FF3B30", textTransform: "uppercase", marginBottom: 8 }}>Submission</div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#ddd" }}>
                                Prepare your ideas and submit the live portfolio link directly in the community.
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 48, textAlign: "center" }}>
                    <a
                        ref={applyBtnRef}
                        href="https://chat.whatsapp.com/CrLws8vbgh86noioaM3YBN?mode=gi_t"
                        target="_blank"
                        rel="noreferrer"
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
                            textDecoration: "none",
                            padding: "20px 48px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            border: "none",
                            textAlign: "center"
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#cc2f26"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#FF3B30"; }}
                    >
                        APPLY NOW
                    </a>
                </div>
            </div>
            
            <style jsx>{`
                @media (max-width: 768px) {
                    .event-section {
                        padding: 80px 20px !important;
                    }
                }
            `}</style>
        </section>
    );
}
