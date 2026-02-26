"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            router.push("/ideas");
        }
    }, [user, loading, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !email.includes("@")) return;
        setIsSubmitting(true);

        const redirectUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/auth/callback`
            : 'https://thesidejob.tech/auth/callback';

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: redirectUrl }
        });

        setIsSubmitting(false);
        if (!error) {
            setSuccess(true);
        }
    };

    if (loading) return <div style={{ background: "#000", height: "100vh" }} />;

    return (
        <div style={{ background: "#000", minHeight: "100vh", position: "relative" }}>
            <div style={{ position: "absolute", top: 32, left: 32 }}>
                <Link href="/" style={{
                    fontFamily: "var(--font-space-mono), monospace",
                    fontSize: 11,
                    color: "#444",
                    textDecoration: "none",
                    transition: "color 0.2s"
                }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#FF3B30"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#444"}
                >
                    ← Back
                </Link>
            </div>

            <div style={{ maxWidth: 440, margin: "0 auto", paddingTop: 140, paddingBottom: 60, paddingLeft: 20, paddingRight: 20 }}>
                <div style={{ fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: 24, color: "#fff", marginBottom: 48 }}>
                    Thesidejob<span style={{ color: "#FF3B30" }}>.</span>
                </div>

                <div style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 11, color: "#FF3B30", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>
                    // MEMBER ACCESS
                </div>

                <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: 56, color: "#fff", lineHeight: 0.9, margin: 0 }}>
                    One login.<br />
                    Everything<br />
                    unlocked<span style={{ color: "#FF3B30" }}>.</span>
                </h1>

                <p style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 12, color: "#555", marginTop: 24, marginBottom: 40, lineHeight: 1.6 }}>
                    Drop ideas. Join Charcha. Get invited to the Hacker House. Enter your email and we'll send a magic link — no password needed.
                </p>

                {success ? (
                    <div style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 13, color: "#32D74B", textAlign: "center", padding: 20 }}>
                        ✓ Magic link sent. Check your inbox.
                    </div>
                ) : (
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            style={{
                                width: "100%",
                                background: "#0a0a0a",
                                border: "1px solid #1a1a1a",
                                color: "#fff",
                                fontFamily: "var(--font-space-mono), monospace",
                                fontSize: 14,
                                padding: "16px 20px",
                                outline: "none",
                                boxSizing: "border-box",
                                transition: "border-color 0.3s"
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = "#FF3B30"}
                            onBlur={e => e.currentTarget.style.borderColor = "#1a1a1a"}
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting || !email.trim()}
                            style={{
                                width: "100%",
                                height: 60,
                                background: "#FF3B30",
                                color: "#000",
                                fontFamily: "var(--font-syne)",
                                fontWeight: 900,
                                fontSize: 15,
                                textTransform: "uppercase",
                                letterSpacing: 3,
                                border: "none",
                                cursor: isSubmitting ? "not-allowed" : "pointer",
                                marginTop: 12,
                                opacity: isSubmitting ? 0.7 : 1
                            }}
                        >
                            {isSubmitting ? "Sending..." : "Send Magic Link →"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
