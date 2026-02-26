"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

interface LoginModalProps {
    onSuccess: (username?: string) => void;
    onClose: () => void;
}

export default function LoginModal({ onSuccess, onClose }: LoginModalProps) {
    const { user, profile, loading } = useAuth();

    // Step 1: email, Step 2: email-sent, Step 3: username
    const [step, setStep] = useState<"email" | "email-sent" | "username">("email");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!loading) {
            if (user && profile) {
                // Fully set up, trigger success immediately
                onSuccess();
            } else if (user && !profile) {
                // Logged in via email clicking link, but no profile yet
                setStep("username");
            }
        }
    }, [user, profile, loading, onSuccess]);

    const handleSendMagicLink = async () => {
        if (!email.trim() || !email.includes("@")) {
            setError("Please enter a valid email.");
            return;
        }
        setIsSubmitting(true);
        setError("");

        const { error: signInError } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin
            }
        });

        setIsSubmitting(false);

        if (signInError) {
            setError(signInError.message);
        } else {
            setStep("email-sent");
        }
    };

    const handleSetUsername = async () => {
        if (!username.trim()) {
            setError("Please enter a username.");
            return;
        }
        setIsSubmitting(true);
        setError("");

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            setError("Authentication session lost. Please reload.");
            setIsSubmitting(false);
            return;
        }

        const { data: existing } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username.trim())
            .single();

        if (existing) {
            setError('Username already taken. Choose another.');
            setIsSubmitting(false);
            return;
        }

        const { error: insertError } = await supabase.from("profiles").upsert([{
            id: session.user.id,
            username: username.trim(),
            email: session.user.email,
            created_at: new Date().toISOString()
        }], { onConflict: 'id' });

        setIsSubmitting(false);

        if (insertError) {
            if (insertError.code === "23505") { // Unique violation
                setError("This username is already taken.");
            } else {
                setError("Failed to create profile. Try again.");
            }
            return;
        }

        // Profile created successfully!
        onSuccess(username.trim());
    };

    // Close on overlay click
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            onClick={handleOverlayClick}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.9)",
                backdropFilter: "blur(12px)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 20
            }}
        >
            <div
                style={{
                    background: "#0a0a0a",
                    border: "1px solid #1a1a1a",
                    borderRadius: 0,
                    padding: "40px",
                    width: "100%",
                    maxWidth: 480,
                    position: "relative"
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        background: "none",
                        border: "none",
                        color: "#555",
                        cursor: "pointer",
                        fontSize: 24,
                        padding: 8
                    }}
                >
                    ×
                </button>

                {error && (
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#FF3B30", marginBottom: 16 }}>
                        {error}
                    </div>
                )}

                {step === "email" && (
                    <>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#FF3B30", marginBottom: 8 }}>
                            // SECURE ACCESS
                        </div>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: 32, color: "#fff", margin: "0 0 16px" }}>
                            Join the Hacker House.
                        </h2>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#555", marginBottom: 32, lineHeight: 1.6 }}>
                            Enter your email to get a magic login link. No passwords needed.
                        </p>

                        <div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", marginBottom: 8, letterSpacing: 1 }}>
                                YOUR EMAIL
                            </div>
                            <input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                type="email"
                                placeholder="john@example.com"
                                style={{
                                    width: "100%",
                                    padding: "16px",
                                    background: "#111",
                                    border: "1px solid #222",
                                    color: "#fff",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 14,
                                    outline: "none",
                                    boxSizing: "border-box",
                                    marginBottom: 16
                                }}
                            />
                        </div>
                        <button
                            onClick={handleSendMagicLink}
                            disabled={isSubmitting}
                            style={{
                                width: "100%",
                                padding: "16px",
                                background: "#FF3B30",
                                border: "none",
                                color: "#fff",
                                fontFamily: "var(--font-syne)",
                                fontWeight: 900,
                                fontSize: 16,
                                cursor: isSubmitting ? "not-allowed" : "pointer",
                                opacity: isSubmitting ? 0.7 : 1
                            }}
                        >
                            {isSubmitting ? "Sending..." : "Send Magic Link →"}
                        </button>
                    </>
                )}

                {step === "email-sent" && (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                        <div style={{ fontSize: 48, marginBottom: 20 }}>📬</div>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: 28, color: "#fff", marginBottom: 16 }}>
                            Check your email.
                        </h2>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#555", lineHeight: 1.6 }}>
                            We sent a magic link to <strong style={{ color: "#fff" }}>{email}</strong>. Click the link to securely log in.
                        </p>
                    </div>
                )}

                {step === "username" && (
                    <>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: 28, color: "#fff", margin: "0 0 16px" }}>
                            Choose your username.
                        </h2>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#555", marginBottom: 32, lineHeight: 1.6 }}>
                            This is how you will be known in Charcha. <br />
                            <strong style={{ color: "#FF3B30" }}>Note: This cannot be changed later.</strong>
                        </p>

                        <div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", marginBottom: 8, letterSpacing: 1 }}>
                                USERNAME
                            </div>
                            <input
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="neo"
                                style={{
                                    width: "100%",
                                    padding: "16px",
                                    background: "#111",
                                    border: "1px solid #222",
                                    color: "#fff",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 14,
                                    outline: "none",
                                    boxSizing: "border-box",
                                    marginBottom: 16
                                }}
                            />
                        </div>
                        <button
                            onClick={handleSetUsername}
                            disabled={isSubmitting}
                            style={{
                                width: "100%",
                                padding: "16px",
                                background: "#FF3B30",
                                border: "none",
                                color: "#000",
                                fontFamily: "var(--font-syne)",
                                fontWeight: 900,
                                fontSize: 16,
                                cursor: isSubmitting ? "not-allowed" : "pointer",
                                opacity: isSubmitting ? 0.7 : 1
                            }}
                        >
                            {isSubmitting ? "Saving..." : "Lock in Username →"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
