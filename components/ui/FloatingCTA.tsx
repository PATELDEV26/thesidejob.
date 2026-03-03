"use client";

import { useRef, useState, useEffect } from "react";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

export default function FloatingCTA() {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [expanded, setExpanded] = useState(false);
    const [visible, setVisible] = useState(false);
    useMagneticEffect(btnRef, 0.5);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > window.innerHeight * 0.5);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToJoin = () => {
        const joinSection = document.getElementById("join-us");
        if (joinSection) {
            joinSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    if (!visible) return null;

    return (
        <>
            <a
                ref={btnRef as any}
                href="/#join-us"
                className="magnetic floating-cta-btn"
                onClick={(e) => {
                    if (window.location.pathname === '/') {
                        e.preventDefault()
                        const el = document.getElementById('join-us')
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }
                }}
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
                style={{
                    position: "fixed",
                    bottom: 40,
                    right: 40,
                    zIndex: 500,
                    height: 56,
                    width: expanded ? "auto" : 56,
                    minWidth: expanded ? 160 : 56,
                    maxWidth: 200,
                    background: "#FF3B30",
                    border: "none",
                    borderRadius: 28,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: expanded ? "flex-start" : "center",
                    gap: 12,
                    padding: expanded ? "0 20px" : 0,
                    transition: "width 0.3s ease, min-width 0.3s ease, padding 0.3s ease",
                    overflow: "visible",
                    textDecoration: "none",
                }}
            >
                {/* Pencil/edit icon */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                    <path
                        d="M14.5 2.5L17.5 5.5L6 17H3V14L14.5 2.5Z"
                        stroke="#000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <span
                    style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 900,
                        fontSize: 12,
                        letterSpacing: 2,
                        color: "#000",
                        whiteSpace: "nowrap",
                        opacity: expanded ? 1 : 0,
                        transition: "opacity 0.2s ease",
                        textTransform: "uppercase",
                    }}
                >
                    APPLY NOW
                </span>
            </a>
            <style jsx>{`
                @media (max-width: 768px) {
                    .floating-cta-btn {
                        bottom: 20px !important;
                        right: 20px !important;
                        height: 48px !important;
                        width: 48px !important;
                        min-width: 48px !important;
                        border-radius: 24px !important;
                    }
                }
            `}</style>
        </>
    );
}
