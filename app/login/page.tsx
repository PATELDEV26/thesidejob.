"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    // Email Step States
    const [email, setEmail] = useState("");
    const [emailStep, setEmailStep] = useState<"input" | "verify">("input");

    // Common States
    const [code, setCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [resendTimer, setResendTimer] = useState(0);

    useEffect(() => {
        if (!loading && user) {
            router.push("/ideas");
        }
    }, [user, loading, router]);

    // Timer logic for Resend
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleSendOTP = async (e: React.FormEvent, isResend = false) => {
        if (e) e.preventDefault();
        setErrorMsg("");

        if (!email.trim() || !email.includes("@")) {
            setErrorMsg("Please enter a valid email address.");
            return;
        }

        setIsSubmitting(true);
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { shouldCreateUser: true }
        });
        setIsSubmitting(false);

        if (error) {
            setErrorMsg(error.message);
        } else {
            if (!isResend) setEmailStep("verify");
            setResendTimer(30);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length !== 6) {
            setErrorMsg("Please enter a 6-digit code.");
            return;
        }

        setErrorMsg("");
        setIsSubmitting(true);

        const { error } = await supabase.auth.verifyOtp({
            email,
            token: code,
            type: "email",
        });

        setIsSubmitting(false);

        if (error) {
            setErrorMsg(error.message);
        } else {
            router.push("/ideas");
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

                <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: 56, color: "#fff", lineHeight: 0.9, margin: 0, marginBottom: 40 }}>
                    One login.<br />
                    Everything<br />
                    unlocked<span style={{ color: "#FF3B30" }}>.</span>
                </h1>

                {emailStep === "input" ? (
                    <form onSubmit={handleSendOTP}>
                        <div style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 12, color: "#555", marginBottom: 16 }}>
                            Enter your email to receive a login code
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            style={{
                                width: "100%", background: "#0a0a0a", border: "1px solid #1a1a1a", color: "#fff",
                                fontFamily: "var(--font-space-mono), monospace", fontSize: 14, padding: "16px 20px",
                                outline: "none", boxSizing: "border-box", transition: "border-color 0.3s"
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = "#FF3B30"}
                            onBlur={e => e.currentTarget.style.borderColor = "#1a1a1a"}
                        />
                        {errorMsg && <div style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 11, color: "#FF3B30", marginTop: 8 }}>{errorMsg}</div>}
                        <button
                            type="submit"
                            disabled={isSubmitting || !email.trim()}
                            style={{
                                width: "100%", height: 60, background: "#FF3B30", color: "#000", fontFamily: "var(--font-syne)",
                                fontWeight: 900, fontSize: 15, textTransform: "uppercase", letterSpacing: 3, border: "none",
                                cursor: isSubmitting ? "not-allowed" : "pointer", marginTop: 12, opacity: isSubmitting ? 0.7 : 1
                            }}
                        >
                            {isSubmitting ? "Sending..." : "Send Code →"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify}>
                        <div style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 12, color: "#555", marginBottom: 16 }}>
                            Code sent to {email}
                        </div>
                        <input
                            type="number"
                            required
                            maxLength={6}
                            value={code}
                            onChange={e => setCode(e.target.value.slice(0, 6))}
                            placeholder="000000"
                            style={{
                                width: "100%", background: "#0a0a0a", border: "1px solid #1a1a1a", color: "#fff",
                                fontFamily: "var(--font-space-mono), monospace", fontSize: 24, letterSpacing: 8, padding: "16px 20px", textIndent: 12,
                                outline: "none", boxSizing: "border-box", transition: "border-color 0.3s", textAlign: "center"
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = "#FF3B30"}
                            onBlur={e => e.currentTarget.style.borderColor = "#1a1a1a"}
                        />
                        {errorMsg && <div style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 11, color: "#FF3B30", marginTop: 8 }}>{errorMsg}</div>}
                        <button
                            type="submit"
                            disabled={isSubmitting || code.length < 6}
                            style={{
                                width: "100%", height: 60, background: "#FF3B30", color: "#000", fontFamily: "var(--font-syne)",
                                fontWeight: 900, fontSize: 15, textTransform: "uppercase", letterSpacing: 3, border: "none",
                                cursor: isSubmitting ? "not-allowed" : "pointer", marginTop: 12, opacity: isSubmitting ? 0.7 : 1
                            }}
                        >
                            {isSubmitting ? "Verifying..." : "Verify Code →"}
                        </button>

                        <div style={{ marginTop: 24, textAlign: "center" }}>
                            {resendTimer > 0 ? (
                                <span style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 11, color: "#555" }}>
                                    Resend in {resendTimer}s
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={(e) => handleSendOTP(e, true)}
                                    style={{
                                        background: "transparent", border: "none", color: "#FF3B30", cursor: "pointer",
                                        fontFamily: "var(--font-space-mono), monospace", fontSize: 11, textDecoration: "underline"
                                    }}
                                >
                                    Resend Code
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </div>
            <style jsx>{`
                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type="number"] {
                    -moz-appearance: textfield;
                }
            `}</style>
        </div>
    );
}
