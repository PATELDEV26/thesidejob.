"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function IdeasPage() {
    const router = useRouter();
    const [ideaTitle, setIdeaTitle] = useState("");
    const [ideaDesc, setIdeaDesc] = useState("");
    const [ideaName, setIdeaName] = useState("");
    const [ideaEmail, setIdeaEmail] = useState("");
    const [ideaPhone, setIdeaPhone] = useState("");
    const [ideaSubmitting, setIdeaSubmitting] = useState(false);
    const [ideaSuccess, setIdeaSuccess] = useState(false);

    useEffect(() => {
        const savedName = localStorage.getItem("charcha_username");
        if (savedName) setIdeaName(savedName);
    }, []);

    const submitIdea = async () => {
        if (!ideaTitle.trim() || !ideaDesc.trim() || !ideaEmail.trim()) {
            alert("Please fill in the required fields: Title, Description, and Email.");
            return;
        }

        setIdeaSubmitting(true);
        const { error } = await supabase.from("ideas").insert([
            {
                title: ideaTitle,
                description: ideaDesc,
                name: ideaName || "Anonymous",
                email: ideaEmail,
                phone: ideaPhone,
                submitted_by: ideaName || "Anonymous",
                status: "ideas", // Match admin board default
            }
        ]);
        setIdeaSubmitting(false);

        if (error) {
            console.error("Error submitting idea:", error);
            alert("Oops! Something went wrong saving your idea.");
        } else {
            setIdeaSuccess(true);
            setTimeout(() => {
                router.push("/");
            }, 3000);
        }
    };

    return (
        <div style={{ background: "#000", minHeight: "100vh", position: "relative", zIndex: 1 }}>
            {/* Fixed top nav */}
            <nav
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    background: "rgba(0,0,0,0.9)",
                    backdropFilter: "blur(20px)",
                    borderBottom: "1px solid #111",
                    padding: "20px 48px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Link
                    href="/"
                    style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 900,
                        fontSize: 18,
                        color: "#fff",
                        textDecoration: "none",
                    }}
                >
                    Thesidejob<span style={{ color: "#FF3B30" }}>.</span>
                </Link>
                <Link
                    href="/"
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "#555",
                        textDecoration: "none",
                        transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B30")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                >
                    ← Main Site
                </Link>
            </nav>

            <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: "100vh", padding: "120px 20px 40px"
            }}>
                <div style={{
                    background: "#0a0a0a", border: "1px solid #1a1a1a", boxSizing: "border-box",
                    padding: "40px", width: "100%", maxWidth: 560, position: "relative"
                }}>
                    {ideaSuccess ? (
                        <div style={{ textAlign: "center", padding: "60px 0" }}>
                            <div style={{ fontSize: 48, marginBottom: 20 }}>🚀</div>
                            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: 28, color: "#fff", marginBottom: 16 }}>
                                Idea submitted.
                            </h2>
                            <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#32D74B" }}>
                                We'll be in touch. Watch your inbox. Redirecting...
                            </p>
                        </div>
                    ) : (
                        <>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#FF3B30", marginBottom: 8 }}>// Drop Your Idea</div>
                            <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: 28, color: "#fff", margin: "0 0 16px" }}>
                                Got something worth building?
                            </h2>
                            <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#555", marginBottom: 32, lineHeight: 1.6 }}>
                                Share your idea with the Thesidejob team. The best ideas get invited to the Hacker House every weekend.
                            </p>

                            <div style={{ display: "grid", gap: 20 }}>
                                <div>
                                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", marginBottom: 8, letterSpacing: 1 }}>IDEA TITLE *</div>
                                    <input value={ideaTitle} onChange={e => setIdeaTitle(e.target.value)}
                                        placeholder="Eg: Smart contract auditor for Solana"
                                        style={{ width: "100%", padding: "12px 16px", background: "#111", border: "1px solid #222", color: "#fff", fontFamily: "var(--font-mono)", fontSize: 13, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                                        onFocus={e => e.target.style.borderColor = "#FF3B30"}
                                        onBlur={e => e.target.style.borderColor = "#222"}
                                    />
                                </div>
                                <div>
                                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", marginBottom: 8, letterSpacing: 1 }}>WHAT ARE YOU BUILDING *</div>
                                    <textarea value={ideaDesc} onChange={e => setIdeaDesc(e.target.value)} rows={4}
                                        placeholder="Describe your idea in detail..."
                                        style={{ width: "100%", padding: "12px 16px", background: "#111", border: "1px solid #222", color: "#fff", fontFamily: "var(--font-mono)", fontSize: 13, outline: "none", boxSizing: "border-box", resize: "vertical", transition: "border-color 0.2s" }}
                                        onFocus={e => e.target.style.borderColor = "#FF3B30"}
                                        onBlur={e => e.target.style.borderColor = "#222"}
                                    />
                                </div>
                                <div>
                                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", marginBottom: 8, letterSpacing: 1 }}>YOUR NAME</div>
                                    <input value={ideaName} onChange={e => setIdeaName(e.target.value)}
                                        placeholder="Dhariya Patel"
                                        style={{ width: "100%", padding: "12px 16px", background: "#111", border: "1px solid #222", color: "#fff", fontFamily: "var(--font-mono)", fontSize: 13, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                                        onFocus={e => e.target.style.borderColor = "#FF3B30"}
                                        onBlur={e => e.target.style.borderColor = "#222"}
                                    />
                                </div>
                                <div>
                                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", marginBottom: 8, letterSpacing: 1 }}>YOUR EMAIL *</div>
                                    <input value={ideaEmail} onChange={e => setIdeaEmail(e.target.value)} type="email"
                                        placeholder="john@example.com"
                                        style={{ width: "100%", padding: "12px 16px", background: "#111", border: "1px solid #222", color: "#fff", fontFamily: "var(--font-mono)", fontSize: 13, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                                        onFocus={e => e.target.style.borderColor = "#FF3B30"}
                                        onBlur={e => e.target.style.borderColor = "#222"}
                                    />
                                </div>
                                <div>
                                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", marginBottom: 8, letterSpacing: 1 }}>YOUR PHONE (OPTIONAL)</div>
                                    <input value={ideaPhone} onChange={e => setIdeaPhone(e.target.value)} type="tel"
                                        placeholder="+91 XXXXX XXXXX"
                                        style={{ width: "100%", padding: "12px 16px", background: "#111", border: "1px solid #222", color: "#fff", fontFamily: "var(--font-mono)", fontSize: 13, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
                                        onFocus={e => e.target.style.borderColor = "#FF3B30"}
                                        onBlur={e => e.target.style.borderColor = "#222"}
                                    />
                                </div>
                                <button onClick={submitIdea} disabled={ideaSubmitting} style={{
                                    width: "100%", padding: "16px", background: "#FF3B30", border: "none", color: "#fff",
                                    fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 14, cursor: ideaSubmitting ? "not-allowed" : "pointer",
                                    marginTop: 8, transition: "background 0.2s"
                                }}
                                    onMouseEnter={(e) => {
                                        if (!ideaSubmitting) e.currentTarget.style.background = "#e0332a"
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!ideaSubmitting) e.currentTarget.style.background = "#FF3B30"
                                    }}
                                >
                                    {ideaSubmitting ? "Submitting..." : "Submit Idea →"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
