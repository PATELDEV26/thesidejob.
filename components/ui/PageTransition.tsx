"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "@/lib/gsap";

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        // Animate content in on route change
        const content = document.querySelector(".page-transition-content");
        const panel = document.querySelector(".page-transition-panel");

        if (panel && content) {
            gsap.fromTo(panel,
                { y: "0%" },
                {
                    y: "-100%",
                    duration: 0.4,
                    ease: "power2.out",
                    delay: 0.1,
                }
            );
            gsap.fromTo(content,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, delay: 0.3 }
            );
        }
    }, [pathname]);

    return (
        <>
            <div className="page-transition-content">
                {children}
            </div>
            {/* Transition panel */}
            <div
                className="page-transition-panel"
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "#FF3B30",
                    zIndex: 9990,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                    transform: "translateY(-100%)",
                }}
            >
                <span
                    style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 900,
                        fontSize: 32,
                        color: "#000",
                        letterSpacing: "-1px",
                    }}
                >
                    Thesidejob.
                </span>
            </div>
        </>
    );
}
