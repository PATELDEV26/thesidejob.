"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [lastSignUpTime, setLastSignUpTime] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (isSignUp) {
            // Prevent spamming sign-up (rate limit protection: 60s cooldown)
            const now = Date.now();
            if (now - lastSignUpTime < 60000) {
                const secondsLeft = Math.ceil((60000 - (now - lastSignUpTime)) / 1000);
                setError(`Please wait ${secondsLeft}s before trying again.`);
                return;
            }
        }

        setLoading(true);

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/community`,
                    },
                });
                if (error) {
                    if (error.message.toLowerCase().includes("rate limit")) {
                        throw new Error("Too many attempts. Please wait a minute and try again.");
                    }
                    throw error;
                }

                setLastSignUpTime(Date.now());

                // If Supabase auto-confirmed (email confirmation disabled in dashboard),
                // a session is returned — redirect straight to chat
                if (data.session) {
                    router.push("/community");
                    return;
                }

                // If user already exists but is unconfirmed, data.user will exist but
                // identities array will be empty
                if (data.user && data.user.identities && data.user.identities.length === 0) {
                    setError("An account with this email already exists. Try signing in instead.");
                    setIsSignUp(false);
                    return;
                }

                setSuccess("Account created! Check your email for a confirmation link, then sign in.");
                setIsSignUp(false);
                setPassword("");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) {
                    if (error.message === "Invalid login credentials") {
                        throw new Error("Wrong email or password. If you just signed up, check your email to confirm first.");
                    }
                    if (error.message === "Email not confirmed") {
                        throw new Error("Your email is not confirmed yet. Check your inbox for the confirmation link.");
                    }
                    if (error.message.toLowerCase().includes("rate limit")) {
                        throw new Error("Too many attempts. Please wait a minute and try again.");
                    }
                    throw error;
                }
                router.push("/community");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/community`,
            },
        });
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                position: "relative",
            }}
        >
            {/* Back to home */}
            <Link
                href="/"
                style={{
                    position: "absolute",
                    top: 32,
                    left: 48,
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: 2,
                    color: "#555",
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B30")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
            >
                ← BACK
            </Link>

            <div
                style={{
                    width: "100%",
                    maxWidth: 420,
                    background: "#050505",
                    border: "1px solid #111",
                    padding: "48px 40px",
                }}
            >
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            background: "#FF3B30",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "var(--font-syne)",
                            fontWeight: 900,
                            fontSize: 16,
                            color: "#000",
                            marginBottom: 16,
                        }}
                    >
                        TSJ
                    </div>
                    <div
                        style={{
                            fontFamily: "var(--font-syne)",
                            fontWeight: 800,
                            fontSize: 24,
                            color: "#fff",
                            marginBottom: 4,
                        }}
                    >
                        {isSignUp ? "Join Charcha" : "Enter Charcha"}
                    </div>
                    <div
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            color: "#444",
                            letterSpacing: 1,
                        }}
                    >
                        Baat karo. Build karo.
                    </div>
                </div>

                {/* Error / Success messages */}
                {error && (
                    <div
                        style={{
                            background: "rgba(255,59,48,0.1)",
                            border: "1px solid rgba(255,59,48,0.3)",
                            padding: "10px 16px",
                            marginBottom: 20,
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: "#FF3B30",
                        }}
                    >
                        {error}
                    </div>
                )}
                {success && (
                    <div
                        style={{
                            background: "rgba(50,215,75,0.1)",
                            border: "1px solid rgba(50,215,75,0.3)",
                            padding: "10px 16px",
                            marginBottom: 20,
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: "#32D74B",
                        }}
                    >
                        {success}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 16 }}>
                        <label
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 10,
                                letterSpacing: 2,
                                color: "#555",
                                textTransform: "uppercase",
                                display: "block",
                                marginBottom: 8,
                            }}
                        >
                            EMAIL
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            style={{
                                width: "100%",
                                background: "#111",
                                border: "1px solid #1a1a1a",
                                color: "#fff",
                                fontFamily: "var(--font-mono)",
                                fontSize: 13,
                                padding: "14px 16px",
                                outline: "none",
                                transition: "border-color 0.2s ease",
                                boxSizing: "border-box",
                            }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,59,48,0.4)")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "#1a1a1a")}
                        />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 10,
                                letterSpacing: 2,
                                color: "#555",
                                textTransform: "uppercase",
                                display: "block",
                                marginBottom: 8,
                            }}
                        >
                            PASSWORD
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            placeholder="Min 6 characters"
                            style={{
                                width: "100%",
                                background: "#111",
                                border: "1px solid #1a1a1a",
                                color: "#fff",
                                fontFamily: "var(--font-mono)",
                                fontSize: 13,
                                padding: "14px 16px",
                                outline: "none",
                                transition: "border-color 0.2s ease",
                                boxSizing: "border-box",
                            }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,59,48,0.4)")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "#1a1a1a")}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px 0",
                            background: loading ? "#333" : "#FF3B30",
                            border: "none",
                            color: loading ? "#666" : "#000",
                            fontFamily: "var(--font-syne)",
                            fontWeight: 800,
                            fontSize: 14,
                            letterSpacing: 1,
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "opacity 0.2s ease",
                        }}
                        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                    >
                        {loading
                            ? "LOADING..."
                            : isSignUp
                            ? "CREATE ACCOUNT"
                            : "SIGN IN"}
                    </button>
                </form>

                {/* Divider */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        margin: "24px 0",
                    }}
                >
                    <div style={{ flex: 1, height: 1, background: "#1a1a1a" }} />
                    <span
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: "#333",
                            letterSpacing: 2,
                        }}
                    >
                        OR
                    </span>
                    <div style={{ flex: 1, height: 1, background: "#1a1a1a" }} />
                </div>

                {/* Google Sign In */}
                <button
                    onClick={handleGoogleLogin}
                    style={{
                        width: "100%",
                        padding: "12px 0",
                        background: "transparent",
                        border: "1px solid #1a1a1a",
                        color: "#888",
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        letterSpacing: 1,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#333";
                        e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#1a1a1a";
                        e.currentTarget.style.color = "#888";
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 48 48">
                        <path
                            fill="#888"
                            d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                        />
                    </svg>
                    CONTINUE WITH GOOGLE
                </button>

                {/* Toggle sign up / sign in */}
                <div
                    style={{
                        textAlign: "center",
                        marginTop: 24,
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "#444",
                    }}
                >
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <span
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError("");
                            setSuccess("");
                        }}
                        style={{
                            color: "#FF3B30",
                            cursor: "pointer",
                            textDecoration: "underline",
                            textUnderlineOffset: 3,
                        }}
                    >
                        {isSignUp ? "Sign in" : "Sign up"}
                    </span>
                </div>
            </div>
        </div>
    );
}
