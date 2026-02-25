"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";

/*
 * IMPORTANT: These IDs must match the `id` attribute on each section's
 * outermost element in app/page.tsx:
 *   hero        → components/sections/Hero.tsx
 *   about       → components/sections/About.tsx
 *   services    → components/sections/Services.tsx
 *   work        → components/sections/Work.tsx
 *   manifesto   → components/sections/Stats.tsx
 *   contact     → components/layout/Footer.tsx
 */
const SECTIONS = [
    { id: "hero", label: "Hero" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "work", label: "Work" },
    { id: "manifesto", label: "Manifesto" },
    { id: "drop-idea", label: "Ideas" },
    { id: "contact", label: "Contact" },
];

export default function SectionIndicator() {
    const [active, setActive] = useState(0);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    useEffect(() => {
        const triggers: ScrollTrigger[] = [];

        SECTIONS.forEach((section, i) => {
            const el = document.getElementById(section.id);
            if (!el) return;

            const st = ScrollTrigger.create({
                trigger: el,
                start: "top center",
                end: "bottom center",
                onEnter: () => setActive(i),
                onEnterBack: () => setActive(i),
            });
            triggers.push(st);
        });

        return () => {
            triggers.forEach((st) => st.kill());
        };
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (!element) return;

        // Try Lenis first
        const lenis = (window as any).__lenis;
        if (lenis) {
            lenis.scrollTo(element, { offset: 0, duration: 1.2 });
            return;
        }

        // Fallback to native smooth scroll
        element.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <>
            <div
                className="section-indicator"
                style={{
                    position: "fixed",
                    right: 24,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 100,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    alignItems: "flex-end",
                }}
            >
                {SECTIONS.map((section, i) => (
                    <div
                        key={section.id}
                        style={{ position: "relative", display: "flex", alignItems: "center" }}
                        onMouseEnter={() => setHoveredIdx(i)}
                        onMouseLeave={() => setHoveredIdx(null)}
                    >
                        {/* Tooltip */}
                        {hoveredIdx === i && (
                            <div
                                style={{
                                    position: "absolute",
                                    right: 24,
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 10,
                                    letterSpacing: 2,
                                    color: "#fff",
                                    whiteSpace: "nowrap",
                                    background: "#111",
                                    padding: "4px 8px",
                                    border: "1px solid #222",
                                    textTransform: "uppercase",
                                }}
                            >
                                {section.label}
                            </div>
                        )}
                        {/* Dot */}
                        <div
                            onClick={() => scrollToSection(section.id)}
                            style={{
                                width: active === i ? 12 : 6,
                                height: 6,
                                borderRadius: 3,
                                background: active === i ? "#FF3B30" : "transparent",
                                border: `1px solid ${active === i ? "#FF3B30" : "#333"}`,
                                cursor: "pointer",
                                pointerEvents: "auto",
                                transition: "all 0.3s ease",
                            }}
                        />
                    </div>
                ))}
            </div>
            <style jsx>{`
                @media (max-width: 768px) {
                    .section-indicator {
                        display: none !important;
                    }
                }
            `}</style>
        </>
    );
}
