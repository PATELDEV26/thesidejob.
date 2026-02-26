"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthSection() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    const handleLoginRedirect = async (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/login");
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    if (loading) return null;

    return (
        <section style={{
            background: "#000",
            padding: "100px 8vw",
            borderTop: "1px solid #111",
            width: "100%",
            boxSizing: "border-box"
        }}>
            {user ? (
                <div style={{ textAlign: "left" }}>
                    <h2 style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 900,
                        fontSize: 32,
                        color: "#fff",
                        margin: "0 0 8px 0"
                    }}>
                        Welcome back, {profile?.username || user.email}
                    </h2>
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "#555",
                        margin: "0 0 24px 0"
                    }}>
                        You can drop ideas and join Charcha.
                    </p>
                    <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
                        <button
                            onClick={() => {
                                const section = document.getElementById("drop-idea");
                                section?.scrollIntoView({ behavior: "smooth" });
                            }}
                            style={{
                                background: "#FF3B30",
                                color: "#000",
                                fontFamily: "var(--font-syne)",
                                fontWeight: 700,
                                fontSize: 13,
                                padding: "12px 24px",
                                border: "none",
                                borderRadius: 999,
                                cursor: "pointer",
                                textDecoration: "none",
                            }}
                        >
                            Drop an Idea →
                        </button>
                        <button
                            onClick={() => router.push("/community")}
                            style={{
                                background: "transparent",
                                color: "#fff",
                                fontFamily: "var(--font-syne)",
                                fontWeight: 700,
                                fontSize: 13,
                                padding: "12px 24px",
                                border: "1px solid #333",
                                borderRadius: 999,
                                cursor: "pointer",
                            }}
                        >
                            Go to Charcha →
                        </button>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            color: "#333",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            transition: "color 0.2s ease"
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = "#FF3B30"}
                        onMouseLeave={e => e.currentTarget.style.color = "#333"}
                    >
                        Log out
                    </button>
                </div>
            ) : (
                <div style={{ textAlign: "left" }}>
                    <div style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "#FF3B30",
                        letterSpacing: 4,
                        marginBottom: 24
                    }}>
                        // JOIN THE COMMUNITY
                    </div>
                    <h2 style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 900,
                        fontSize: "clamp(40px, 5.5vw, 72px)",
                        letterSpacing: "-2px",
                        lineHeight: 0.92,
                        color: "#fff",
                        margin: 0
                    }}>
                        One login.<br />Everything<br />unlocked<span style={{ color: "#FF3B30" }}>.</span>
                    </h2>
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 13,
                        color: "#555",
                        lineHeight: 1.8,
                        maxWidth: 480,
                        marginTop: 24,
                        marginBottom: 0
                    }}>
                        Drop ideas. Join Charcha. Get invited to the Hacker House. One magic link is all it takes.
                    </p>

                    <form onSubmit={handleLoginRedirect} style={{ marginTop: 24 }}>
                        <button
                            type="submit"
                            style={{
                                background: "#FF3B30",
                                color: "#000",
                                fontFamily: "var(--font-syne)",
                                fontWeight: 900,
                                fontSize: 14,
                                letterSpacing: 2,
                                textTransform: "uppercase",
                                padding: "18px 36px",
                                border: "none",
                                cursor: "pointer",
                                marginTop: 16,
                                width: "fit-content",
                                display: "block"
                            }}
                        >
                            Log In / Sign Up →
                        </button>
                    </form>
                </div>
            )}
        </section>
    );
}
