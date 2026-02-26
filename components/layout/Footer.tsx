"use client";

import { useState, useEffect, memo } from "react";

/* ─── Live Clock ─── */
function LiveClock() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString("en-US", {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })
            );
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <span
            style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "#555",
                letterSpacing: 2,
            }}
        >
            {time}
        </span>
    );
}

/* ─── Footer ─── */
function Footer() {
    return (
        <footer
            id="contact"
            style={{ background: "#000" }}
        >
            {/* Layer 1 — Thin Top Links Bar */}
            <div
                className="footer-links-bar"
                style={{
                    padding: "20px 8vw",
                    background: "#000",
                    borderTop: "1px solid #1a1a1a",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 16,
                }}
            >
                <a
                    href="mailto:thesidejobfive@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "#555",
                        textDecoration: "none",
                        transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B30")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                >
                    thesidejobfive@gmail.com
                </a>

                <div style={{ display: "flex", gap: 32 }}>
                    <a
                        href="https://www.instagram.com/the.side.job?igsh=MWhueDJycjBmd3VhZQ=="
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: "#555",
                            textDecoration: "none",
                            transition: "color 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                    >Instagram</a>
                    <a
                        href="https://www.linkedin.com/in/thesidejob-9b44643b0"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: "#555",
                            textDecoration: "none",
                            transition: "color 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                    >LinkedIn</a>
                    <a
                        href="https://github.com/PATELDEV26"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: "#555",
                            textDecoration: "none",
                            transition: "color 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                    >GitHub</a>
                </div>

                <span
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "#333",
                        letterSpacing: 2,
                    }}
                >
                    VADODARA, GJ · INDIA
                </span>
            </div>

            {/* Layer 2 — Bottom Bar with Watermark */}
            <div
                style={{
                    position: "relative",
                    overflow: "hidden",
                    padding: "24px 8vw",
                    background: "#000000",
                    borderTop: "1px solid #1a1a1a",
                }}
            >
                {/* Ghost watermark */}
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontFamily: "var(--font-syne)",
                        fontWeight: 900,
                        fontSize: "clamp(60px, 10vw, 140px)",
                        color: "rgba(255,255,255,0.04)",
                        WebkitTextStroke: "1px rgba(255,255,255,0.08)",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                        userSelect: "none",
                        zIndex: 0,
                        letterSpacing: -4,
                    }}
                >
                    Thesidejob
                </div>

                {/* Bottom bar content */}
                <div
                    className="footer-bottom-bar"
                    style={{
                        position: "relative",
                        zIndex: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 16,
                    }}
                >
                    {/* Left: Logo + Name */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div>
                            <div
                                style={{
                                    fontFamily: "var(--font-syne)",
                                    fontWeight: 900,
                                    fontSize: 15,
                                    color: "#fff",
                                }}
                            >
                                Thesidejob<span style={{ color: "#FF3B30" }}>.</span>
                            </div>
                            <div
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 10,
                                    color: "#333",
                                    marginTop: 2,
                                }}
                            >
                                Vadodara&apos;s First Hacker House
                            </div>
                        </div>
                    </div>

                    {/* Center: Nav links */}
                    <div style={{ display: "flex", gap: 24 }}>
                        {[
                            { label: "Services", href: "#services" },
                            { label: "Work", href: "#work" },
                            { label: "About", href: "#about" },
                            { label: "Ideas", href: "#drop-idea" },
                            { label: "Support", href: "/support" },
                        ].map(({ label, href }) => (
                            <a
                                key={label}
                                href={href}
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 11,
                                    color: "#444",
                                    textDecoration: "none",
                                    transition: "color 0.3s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}
                            >
                                {label}
                            </a>
                        ))}
                    </div>

                    {/* Right: Clock + Copyright */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                        <LiveClock />
                        <span
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 10,
                                color: "#333",
                            }}
                        >
                            © 2026 thesidejob.co
                        </span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .footer-links-bar {
                        flex-direction: column;
                        align-items: flex-start !important;
                        padding: 20px 6vw !important;
                    }
                    .footer-bottom-bar {
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 24px !important;
                    }
                }
            `}</style>
        </footer>
    );
}

export default memo(Footer);
