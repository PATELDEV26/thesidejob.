"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export default function AuthSection() {
    const { user, profile, loading } = useAuth();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setStatus("loading");
        setErrorMsg("");

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin
            }
        });

        if (error) {
            setStatus("error");
            setErrorMsg(error.message);
        } else {
            setStatus("sent");
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    if (loading) return null;

    return (
        <section style={{
            background: "#0a0a0a",
            padding: "80px 8vw",
            display: "flex",
            justifyContent: "center",
            borderTop: "1px solid #1a1a1a",
        }}>
            <div style={{
                width: "100%",
                maxWidth: 480,
                textAlign: "center"
            }}>
                {user ? (
                    <div>
                        <h2 style={{
                            fontFamily: "var(--font-syne)",
                            fontWeight: 900,
                            fontSize: 32,
                            color: "#fff",
                            marginBottom: 8
                        }}>
                            Welcome back, {profile?.username || user.email}
                        </h2>
                        <button
                            onClick={handleLogout}
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 11,
                                color: "#333",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                textTransform: "uppercase",
                                letterSpacing: 2,
                                transition: "color 0.2s ease"
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = "#FF3B30"}
                            onMouseLeave={e => e.currentTarget.style.color = "#333"}
                        >
                            Log out
                        </button>
                    </div>
                ) : (
                    <div>
                        <div style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            color: "#FF3B30",
                            letterSpacing: 2,
                            marginBottom: 16
                        }}>
                            // JOIN THE COMMUNITY
                        </div>
                        <h2 style={{
                            fontFamily: "var(--font-syne)",
                            fontWeight: 900,
                            fontSize: "clamp(40px, 6vw, 80px)",
                            color: "#fff",
                            lineHeight: 1,
                            margin: 0
                        }}>
                            One login.<br />Everything unlocked.
                        </h2>
                        <p style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 13,
                            color: "#555",
                            marginTop: 16,
                            marginBottom: 40,
                            lineHeight: 1.6
                        }}>
                            Log in once to drop ideas, join Charcha, and get invited to the Hacker House.
                        </p>

                        {status === "sent" ? (
                            <div style={{
                                padding: "24px",
                                background: "rgba(50, 215, 75, 0.1)",
                                border: "1px solid rgba(50, 215, 75, 0.2)",
                                fontFamily: "var(--font-mono)",
                                fontSize: 13,
                                color: "#32D74B",
                                borderRadius: 8
                            }}>
                                Check your email — link sent.
                            </div>
                        ) : (
                            <form onSubmit={handleLogin} style={{ textAlign: "left" }}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    style={{
                                        width: "100%",
                                        background: "transparent",
                                        border: "none",
                                        borderBottom: "1px solid #333",
                                        color: "#fff",
                                        fontFamily: "var(--font-mono)",
                                        fontSize: 14,
                                        padding: "16px 0",
                                        outline: "none",
                                        transition: "border-color 0.3s ease",
                                        boxSizing: "border-box"
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = "#FF3B30"}
                                    onBlur={e => e.currentTarget.style.borderColor = "#333"}
                                />
                                {errorMsg && (
                                    <div style={{ color: "#FF3B30", fontFamily: "var(--font-mono)", fontSize: 11, marginTop: 8 }}>
                                        {errorMsg}
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    style={{
                                        width: "100%",
                                        height: 56,
                                        background: "#FF3B30",
                                        marginTop: 16,
                                        border: "none",
                                        color: "#000",
                                        fontFamily: "var(--font-syne)",
                                        fontWeight: 900,
                                        fontSize: 16,
                                        cursor: status === "loading" ? "not-allowed" : "pointer",
                                        opacity: status === "loading" ? 0.7 : 1,
                                        textTransform: "uppercase"
                                    }}
                                >
                                    {status === "loading" ? "SENDING..." : "Send Login Link →"}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
