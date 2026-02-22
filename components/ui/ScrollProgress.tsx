"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ScrollProgress() {
    const [progress, setProgress] = useState(0);
    const pathname = usePathname();

    useEffect(() => {
        // Don't show on community page
        if (pathname === "/community") return;

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                setProgress(Math.min(scrollTop / docHeight, 1));
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathname]);

    if (pathname === "/community") return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: `${progress * 100}%`,
                height: 2,
                background: "#FF3B30",
                zIndex: 9999,
                transition: "width 0.1s linear",
                pointerEvents: "none",
            }}
        />
    );
}
