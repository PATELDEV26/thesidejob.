"use client";

import { useEffect, useRef } from "react";
import gsap from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";

const SERVICES = [
    {
        num: "01",
        name: "Product Design",
        desc: "From wireframes to pixel-perfect interfaces that convert and delight.",
    },
    {
        num: "02",
        name: "Full-Stack Development",
        desc: "We build fast, scalable, and maintainable web applications.",
    },
    {
        num: "03",
        name: "Brand Identity",
        desc: "Logos, systems, and guidelines that make you unforgettable.",
    },
    {
        num: "04",
        name: "Growth Strategy",
        desc: "From launch to scale. We help you find your first 1000 users.",
    },
];

export default function Services() {
    const sectionRef = useRef<HTMLElement>(null);
    const headlineRef = useRef<HTMLDivElement>(null);
    const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Headline clip in
            if (headlineRef.current) {
                const inner = headlineRef.current.querySelector(".srv-headline-inner");
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

            // Rows stagger in
            rowRefs.current.forEach((row, i) => {
                if (row) {
                    gsap.from(row, {
                        y: 60,
                        opacity: 0,
                        duration: 0.7,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: row,
                            start: "top 90%",
                        },
                        delay: i * 0.1,
                    });
                }
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="services"
            className="services-section"
            style={{
                background: "#050505",
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
                {`// 01`}
            </div>

            {/* Headline */}
            <div ref={headlineRef} style={{ overflow: "hidden", marginBottom: 80 }}>
                <div
                    className="srv-headline-inner"
                    style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 900,
                        fontSize: "clamp(64px, 9vw, 130px)",
                        letterSpacing: -4,
                        color: "#fff",
                    }}
                >
                    Services
                </div>
            </div>

            {/* Service Rows */}
            {SERVICES.map((service, i) => (
                <div
                    key={service.num}
                    ref={(el) => { rowRefs.current[i] = el; }}
                    className="service-row"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 48,
                        padding: "40px 0",
                        borderBottom: "1px solid #111",
                        transition: "background 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,59,48,0.02)";
                        const arrow = e.currentTarget.querySelector(".srv-arrow") as HTMLElement;
                        if (arrow) arrow.style.color = "#FF3B30";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        const arrow = e.currentTarget.querySelector(".srv-arrow") as HTMLElement;
                        if (arrow) arrow.style.color = "#333";
                    }}
                >
                    {/* Number */}
                    <span
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 13,
                            color: "#222",
                            width: 48,
                            flexShrink: 0,
                        }}
                    >
                        {service.num}
                    </span>

                    {/* Name */}
                    <span
                        style={{
                            fontFamily: "var(--font-syne)",
                            fontWeight: 800,
                            fontSize: 32,
                            color: "#fff",
                            flexGrow: 1,
                        }}
                    >
                        {service.name}
                    </span>

                    {/* Description */}
                    <span
                        className="srv-desc"
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: "#555",
                            maxWidth: 360,
                        }}
                    >
                        {service.desc}
                    </span>

                    {/* Arrow */}
                    <span
                        className="srv-arrow"
                        style={{
                            color: "#333",
                            fontSize: 20,
                            transition: "color 0.3s ease",
                        }}
                    >
                        →
                    </span>
                </div>
            ))}

            <style jsx>{`
                @media (max-width: 768px) {
                    .services-section {
                        padding: 80px 6vw !important;
                    }
                    .service-row {
                        flex-wrap: wrap;
                        gap: 12px !important;
                        padding: 28px 0 !important;
                    }
                    .srv-desc {
                        max-width: 100% !important;
                        order: 4;
                    }
                    .srv-arrow {
                        margin-left: auto;
                    }
                }
            `}</style>
        </section>
    );
}
