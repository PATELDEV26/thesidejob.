"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export default function IdeasPage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    const [emailStr, setEmailStr] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [magicLinkSent, setMagicLinkSent] = useState(false);

    // Form states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [phone, setPhone] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSendMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailStr.trim() || !emailStr.includes("@")) return;
        setIsSubmitting(true);

        const { error } = await supabase.auth.signInWithOtp({
            email: emailStr,
            options: { emailRedirectTo: 'https://thesidejob.tech/ideas' }
        });

        setIsSubmitting(false);
        if (!error) setMagicLinkSent(true);
    };

    const handleDropIdea = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim() || !user || !profile) return;
        setIsSubmitting(true);

        const { error } = await supabase.from('ideas').insert([{
            title: title.trim(),
            description: description.trim(),
            submitted_by: profile.username,
            email: user.email,
            phone: phone.trim() || null,
            status: 'ideas'
        }]);

        setIsSubmitting(false);
        if (!error) setFormSubmitted(true);
    };

    if (loading) {
        return <div style={{ background: "#000", height: "100vh" }} />;
    }

    return (
        <div style={{ background: "#000", minHeight: "100vh", paddingTop: "120px", paddingBottom: "120px" }}>
            {(!user || !profile) ? (
                // NOT LOGGED IN STATE
                <div style={{ padding: "0 8vw", textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
                    <div style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 11, color: "#FF3B30", letterSpacing: 4, textTransform: "uppercase", marginBottom: 24 }}>
                        // SHARE YOUR VISION
                    </div>
                    <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: "clamp(48px, 7vw, 96px)", color: "#fff", lineHeight: 1, margin: "0 0 24px" }}>
                        Got a crazy Idea<span style={{ color: "#FF3B30" }}>?</span>
                    </h1>
                    <p style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 13, color: "#555", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.6 }}>
                        The best ideas get invited to the Hacker House. Log in first to drop your idea.
                    </p>

                    {magicLinkSent ? (
                        <div style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 13, color: "#32D74B", padding: 20 }}>
                            Magic link sent. Check your email.
                        </div>
                    ) : (
                        <form onSubmit={handleSendMagicLink} style={{ maxWidth: 400, margin: "0 auto" }}>
                            <input
                                type="email"
                                value={emailStr}
                                onChange={e => setEmailStr(e.target.value)}
                                placeholder="your@email.com"
                                style={{
                                    width: "100%",
                                    background: "transparent",
                                    border: "none",
                                    borderBottom: "1px solid #333",
                                    color: "#fff",
                                    fontFamily: "var(--font-space-mono), monospace",
                                    fontSize: 14,
                                    padding: "16px 0",
                                    outline: "none",
                                    boxSizing: "border-box",
                                    transition: "border-color 0.3s"
                                }}
                                onFocus={(e) => (e.currentTarget.style.borderColor = "#FF3B30")}
                                onBlur={(e) => (e.currentTarget.style.borderColor = "#333")}
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting || !emailStr.trim()}
                                style={{
                                    background: "#FF3B30",
                                    color: "#000",
                                    fontFamily: "var(--font-syne)",
                                    fontWeight: 900,
                                    fontSize: 14,
                                    padding: "18px 36px",
                                    border: "none",
                                    cursor: isSubmitting ? "not-allowed" : "pointer",
                                    marginTop: 32,
                                    opacity: isSubmitting ? 0.7 : 1,
                                    textTransform: "uppercase",
                                    letterSpacing: 2
                                }}
                            >
                                {isSubmitting ? "Sending..." : "Send Login Link →"}
                            </button>
                        </form>
                    )}
                </div>
            ) : (
                // LOGGED IN STATE
                <div style={{ padding: "0 8vw" }}>
                    <div style={{ textAlign: "center", marginBottom: 64 }}>
                        <div style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 11, color: "#FF3B30", letterSpacing: 4, textTransform: "uppercase", marginBottom: 24 }}>
                            // SHARE YOUR VISION
                        </div>
                        <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: "clamp(48px, 7vw, 96px)", color: "#fff", lineHeight: 1, margin: 0 }}>
                            Got a crazy Idea<span style={{ color: "#FF3B30" }}>?</span>
                        </h1>
                    </div>

                    <div style={{ maxWidth: 680, margin: "0 auto", background: "#0a0a0a", border: "1px solid #1a1a1a", padding: "48px", boxSizing: "border-box" }}>
                        {formSubmitted ? (
                            <div style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 13, color: "#32D74B", textAlign: "center", padding: "40px 0" }}>
                                Idea dropped. We'll be in touch.
                            </div>
                        ) : (
                            <form onSubmit={handleDropIdea} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                                <div>
                                    <label style={{ display: "block", fontFamily: "var(--font-space-mono), monospace", fontSize: 10, color: "#FF3B30", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
                                        IDEA TITLE
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        style={{
                                            width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #222",
                                            color: "#fff", fontFamily: "var(--font-space-mono), monospace", fontSize: 13, padding: "12px 0",
                                            outline: "none", boxSizing: "border-box", transition: "border-color 0.3s"
                                        }}
                                        onFocus={(e) => (e.currentTarget.style.borderColor = "#FF3B30")}
                                        onBlur={(e) => (e.currentTarget.style.borderColor = "#222")}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontFamily: "var(--font-space-mono), monospace", fontSize: 10, color: "#FF3B30", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
                                        WHAT ARE YOU BUILDING
                                    </label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        style={{
                                            width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #222",
                                            color: "#fff", fontFamily: "var(--font-space-mono), monospace", fontSize: 13, padding: "12px 0",
                                            outline: "none", boxSizing: "border-box", transition: "border-color 0.3s", resize: "vertical"
                                        }}
                                        onFocus={(e) => (e.currentTarget.style.borderColor = "#FF3B30")}
                                        onBlur={(e) => (e.currentTarget.style.borderColor = "#222")}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontFamily: "var(--font-space-mono), monospace", fontSize: 10, color: "#FF3B30", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
                                        YOUR NAME
                                    </label>
                                    <input
                                        readOnly
                                        value={profile.username || ""}
                                        style={{
                                            width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #222",
                                            color: "#888", fontFamily: "var(--font-space-mono), monospace", fontSize: 13, padding: "12px 0",
                                            outline: "none", boxSizing: "border-box"
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontFamily: "var(--font-space-mono), monospace", fontSize: 10, color: "#FF3B30", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
                                        YOUR EMAIL
                                    </label>
                                    <input
                                        readOnly
                                        value={user.email || ""}
                                        style={{
                                            width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #222",
                                            color: "#888", fontFamily: "var(--font-space-mono), monospace", fontSize: 13, padding: "12px 0",
                                            outline: "none", boxSizing: "border-box"
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontFamily: "var(--font-space-mono), monospace", fontSize: 10, color: "#FF3B30", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
                                        YOUR PHONE
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        style={{
                                            width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #222",
                                            color: "#fff", fontFamily: "var(--font-space-mono), monospace", fontSize: 13, padding: "12px 0",
                                            outline: "none", boxSizing: "border-box", transition: "border-color 0.3s"
                                        }}
                                        onFocus={(e) => (e.currentTarget.style.borderColor = "#FF3B30")}
                                        onBlur={(e) => (e.currentTarget.style.borderColor = "#222")}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !title.trim() || !description.trim()}
                                    style={{
                                        width: "100%", height: 56, background: "#FF3B30", color: "#000",
                                        fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: 16, border: "none",
                                        cursor: (isSubmitting || !title.trim() || !description.trim()) ? "not-allowed" : "pointer",
                                        marginTop: 16, opacity: (isSubmitting || !title.trim() || !description.trim()) ? 0.7 : 1,
                                        textTransform: "uppercase", letterSpacing: 2
                                    }}
                                >
                                    {isSubmitting ? "Dropping..." : "Drop Your Idea →"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
