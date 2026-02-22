"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import gsap from "@/lib/gsap";

const SECRET_WORD = "sidejob";

export function useKonamiCode() {
    const [activated, setActivated] = useState(false);
    const [sequence, setSequence] = useState("");
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const close = useCallback(() => {
        const overlay = document.querySelector(".konami-overlay") as HTMLElement;
        if (overlay) {
            gsap.to(overlay, {
                clipPath: "inset(100% 0 0 0)",
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => setActivated(false),
            });
        } else {
            setActivated(false);
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activated) {
                if (e.key === "Escape") close();
                return;
            }

            // Ignore when typing in inputs/textareas
            const tag = (e.target as HTMLElement)?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

            const key = e.key.toLowerCase();
            if (key.length !== 1 || !/[a-z]/.test(key)) return;

            // Reset timer — buffer clears after 2s of no typing
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setSequence(""), 2000);

            const newSeq = (sequence + key).slice(-SECRET_WORD.length);
            setSequence(newSeq);

            if (newSeq === SECRET_WORD) {
                setActivated(true);
                setSequence("");
                if (timerRef.current) clearTimeout(timerRef.current);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [sequence, activated, close]);

    useEffect(() => {
        if (activated) {
            requestAnimationFrame(() => {
                const overlay = document.querySelector(".konami-overlay") as HTMLElement;
                if (overlay) {
                    gsap.fromTo(overlay,
                        { clipPath: "inset(100% 0 0 0)" },
                        { clipPath: "inset(0% 0 0 0)", duration: 0.4, ease: "power2.out" }
                    );
                }
            });
        }
    }, [activated]);

    return { activated, close };
}

export function KonamiOverlay({ activated, close }: { activated: boolean; close: () => void }) {
    if (!activated) return null;

    return (
        <div
            className="konami-overlay"
            onClick={close}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 10000,
                background: "#FF3B30",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                clipPath: "inset(100% 0 0 0)",
            }}
        >
            <div
                style={{
                    fontFamily: "var(--font-syne)",
                    fontWeight: 900,
                    fontSize: "clamp(60px, 12vw, 180px)",
                    color: "#000",
                    letterSpacing: "-4px",
                    lineHeight: 1,
                    textAlign: "center",
                }}
            >
                Thesidejob.
            </div>
            <div
                style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 16,
                    color: "#000",
                    marginTop: 32,
                    letterSpacing: 4,
                    textTransform: "uppercase",
                }}
            >
                🔴 YOU FOUND IT.
            </div>
            <div
                style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "rgba(0,0,0,0.6)",
                    marginTop: 12,
                }}
            >
                apply at thesidejob.in
            </div>
            <div
                style={{
                    position: "absolute",
                    bottom: 48,
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: 4,
                    color: "rgba(0,0,0,0.4)",
                    textTransform: "uppercase",
                }}
            >
                ESC TO EXIT
            </div>
        </div>
    );
}
