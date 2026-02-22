"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

const ROLES = [
    "Select your role",
    "Full-Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "AI / ML Engineer",
    "Designer",
    "Product Manager",
    "Founder / CEO",
    "Marketing / Growth",
    "Other",
];

const HEARD_FROM = [
    "How did you hear about us?",
    "Instagram",
    "X / Twitter",
    "LinkedIn",
    "Friend / Referral",
    "Hackathon",
    "College",
    "Other",
];

export default function JoinUs() {
    const sectionRef = useRef<HTMLElement>(null);
    const formPanelRef = useRef<HTMLDivElement>(null);
    const submitRef = useRef<HTMLButtonElement>(null);
    useMagneticEffect(submitRef, 0.2);

    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "",
        project: "",
        heardFrom: "",
        extra: "",
    });
    const [agreed, setAgreed] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = "Name is required";
        if (!form.email.trim()) errs.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
        if (!form.project.trim()) errs.project = "Tell us what you're building";
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            // Shake animation
            if (formPanelRef.current) {
                const tl = gsap.timeline();
                tl.to(formPanelRef.current, { x: -10, duration: 0.05 })
                    .to(formPanelRef.current, { x: 10, duration: 0.05 })
                    .to(formPanelRef.current, { x: -8, duration: 0.05 })
                    .to(formPanelRef.current, { x: 8, duration: 0.05 })
                    .to(formPanelRef.current, { x: -4, duration: 0.05 })
                    .to(formPanelRef.current, { x: 4, duration: 0.05 })
                    .to(formPanelRef.current, { x: 0, duration: 0.05 });
            }
            return;
        }

        if (!agreed) {
            setSubmitError("Please check the agreement box.");
            return;
        }

        setLoading(true);
        setSubmitError("");

        try {
            const res = await fetch("/api/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    role: form.role,
                    building: form.project,
                    source: form.heardFrom,
                    anything: form.extra,
                    agreed,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to send");

            setSubmitted(true);
        } catch {
            setSubmitError(
                "Something went wrong. Try again or email us directly at hello@thesidejob.co"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) return;

        const ctx = gsap.context(() => {
            if (formPanelRef.current) {
                gsap.from(formPanelRef.current, {
                    y: 60,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: formPanelRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Success animation
    useEffect(() => {
        if (submitted) {
            const successEl = document.querySelector(".join-success");
            if (successEl) {
                gsap.from(successEl, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power3.out",
                });
            }
        }
    }, [submitted]);

    const inputStyle: React.CSSProperties = {
        background: "transparent",
        border: "none",
        borderBottom: "1px solid #222",
        color: "#fff",
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        padding: "16px 0 12px",
        width: "100%",
        outline: "none",
        transition: "border-color 0.3s ease",
    };

    const labelStyle: React.CSSProperties = {
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: 3,
        textTransform: "uppercase" as const,
        color: "#444",
        marginBottom: 8,
        display: "block",
    };

    const selectStyle: React.CSSProperties = {
        ...inputStyle,
        appearance: "none" as const,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23444' stroke-width='1.5'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0 center",
        cursor: "pointer",
    };

    return (
        <section
            ref={sectionRef}
            id="join-us"
            className="joinus-section"
            style={{
                background: "#000",
                padding: "160px 8vw",
                position: "relative",
            }}
        >
            {/* Section header */}
            <div style={{ marginBottom: 64, textAlign: "center" }}>
                <div
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: 5,
                        color: "#FF3B30",
                        marginBottom: 24,
                        textTransform: "uppercase",
                    }}
                >
                    [——— JOIN US ———]
                </div>
                <h2
                    style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 900,
                        fontSize: "clamp(40px, 5.5vw, 80px)",
                        letterSpacing: "-3px",
                        lineHeight: 1,
                        color: "#fff",
                        marginBottom: 16,
                    }}
                >
                    Apply to Thesidejob<span style={{ color: "#FF3B30" }}>.</span>
                </h2>
                <p
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 13,
                        color: "#555",
                        maxWidth: 480,
                        margin: "0 auto",
                        lineHeight: 1.7,
                    }}
                >
                    We&apos;re looking for relentless builders. If you ship fast and think
                    big, you belong here.
                </p>
            </div>

            {/* Form panel */}
            <div
                ref={formPanelRef}
                style={{
                    background: "#0a0a0a",
                    border: "1px solid #1a1a1a",
                    padding: "clamp(32px, 5vw, 56px)",
                    maxWidth: 720,
                    margin: "0 auto",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* L-shaped corner accent */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 24,
                        height: 2,
                        background: "#FF3B30",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 2,
                        height: 24,
                        background: "#FF3B30",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 24,
                        height: 2,
                        background: "#FF3B30",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 2,
                        height: 24,
                        background: "#FF3B30",
                    }}
                />

                {submitted ? (
                    <div
                        className="join-success"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "80px 0",
                            textAlign: "center",
                        }}
                    >
                        {/* Red circle with checkmark */}
                        <div
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                background: "#FF3B30",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 32,
                            }}
                        >
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                <path
                                    d="M10 18L16 24L26 12"
                                    stroke="#fff"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <div
                            style={{
                                fontFamily: "var(--font-syne)",
                                fontWeight: 900,
                                fontSize: 32,
                                color: "#fff",
                                marginBottom: 12,
                            }}
                        >
                            Application Sent.
                        </div>
                        <div
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 13,
                                color: "#555",
                            }}
                        >
                            We&apos;ll be in touch. Keep building.
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* 2-column grid: Name + Email */}
                        <div className="form-grid-2col" style={{ display: "grid", gap: 32, marginBottom: 32 }}>
                            <div>
                                <label style={labelStyle}>Full Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    placeholder="Your name"
                                    style={inputStyle}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderBottomColor = "#FF3B30";
                                        const label = e.currentTarget.previousElementSibling as HTMLElement;
                                        if (label) label.style.color = "#FF3B30";
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderBottomColor = "#222";
                                        const label = e.currentTarget.previousElementSibling as HTMLElement;
                                        if (label) label.style.color = "#444";
                                    }}
                                />
                                {errors.name && (
                                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#FF3B30", marginTop: 6, display: "block" }}>
                                        {errors.name}
                                    </span>
                                )}
                            </div>
                            <div>
                                <label style={labelStyle}>Email Address</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    placeholder="you@email.com"
                                    style={inputStyle}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderBottomColor = "#FF3B30";
                                        const label = e.currentTarget.previousElementSibling as HTMLElement;
                                        if (label) label.style.color = "#FF3B30";
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderBottomColor = "#222";
                                        const label = e.currentTarget.previousElementSibling as HTMLElement;
                                        if (label) label.style.color = "#444";
                                    }}
                                />
                                {errors.email && (
                                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#FF3B30", marginTop: 6, display: "block" }}>
                                        {errors.email}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Role select */}
                        <div style={{ marginBottom: 32 }}>
                            <label style={labelStyle}>Role</label>
                            <select
                                value={form.role}
                                onChange={(e) => handleChange("role", e.target.value)}
                                style={{
                                    ...selectStyle,
                                    color: form.role ? "#fff" : "#555",
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderBottomColor = "#FF3B30";
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderBottomColor = "#222";
                                }}
                            >
                                {ROLES.map((r) => (
                                    <option key={r} value={r === "Select your role" ? "" : r} style={{ background: "#0a0a0a" }}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Project textarea */}
                        <div style={{ marginBottom: 32 }}>
                            <label style={labelStyle}>What Are You Building?</label>
                            <textarea
                                rows={4}
                                value={form.project}
                                onChange={(e) => handleChange("project", e.target.value)}
                                placeholder="Tell us about your project or idea..."
                                style={{ ...inputStyle, resize: "vertical" as const }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderBottomColor = "#FF3B30";
                                    const label = e.currentTarget.previousElementSibling as HTMLElement;
                                    if (label) label.style.color = "#FF3B30";
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderBottomColor = "#222";
                                    const label = e.currentTarget.previousElementSibling as HTMLElement;
                                    if (label) label.style.color = "#444";
                                }}
                            />
                            {errors.project && (
                                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#FF3B30", marginTop: 6, display: "block" }}>
                                    {errors.project}
                                </span>
                            )}
                        </div>

                        {/* Heard from select */}
                        <div style={{ marginBottom: 32 }}>
                            <label style={labelStyle}>How Did You Hear About Us?</label>
                            <select
                                value={form.heardFrom}
                                onChange={(e) => handleChange("heardFrom", e.target.value)}
                                style={{
                                    ...selectStyle,
                                    color: form.heardFrom ? "#fff" : "#555",
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderBottomColor = "#FF3B30";
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderBottomColor = "#222";
                                }}
                            >
                                {HEARD_FROM.map((h) => (
                                    <option key={h} value={h === "How did you hear about us?" ? "" : h} style={{ background: "#0a0a0a" }}>
                                        {h}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Extra textarea */}
                        <div style={{ marginBottom: 32 }}>
                            <label style={labelStyle}>Anything Else?</label>
                            <textarea
                                rows={3}
                                value={form.extra}
                                onChange={(e) => handleChange("extra", e.target.value)}
                                placeholder="Links, portfolio, fun facts..."
                                style={{ ...inputStyle, resize: "vertical" as const }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderBottomColor = "#FF3B30";
                                    const label = e.currentTarget.previousElementSibling as HTMLElement;
                                    if (label) label.style.color = "#FF3B30";
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderBottomColor = "#222";
                                    const label = e.currentTarget.previousElementSibling as HTMLElement;
                                    if (label) label.style.color = "#444";
                                }}
                            />
                        </div>

                        {/* Checkbox */}
                        <div style={{ marginBottom: 32, display: "flex", alignItems: "center", gap: 12 }}>
                            <div
                                onClick={() => setAgreed(!agreed)}
                                style={{
                                    width: 16,
                                    height: 16,
                                    border: `1px solid ${agreed ? "#FF3B30" : "#333"}`,
                                    background: agreed ? "#FF3B30" : "transparent",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    flexShrink: 0,
                                }}
                            >
                                {agreed && (
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                        <path d="M2 5L4 7L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                            <span
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 11,
                                    color: "#444",
                                    cursor: "pointer",
                                }}
                                onClick={() => setAgreed(!agreed)}
                            >
                                I&apos;m ready to build something real. Let&apos;s go.
                            </span>
                        </div>

                        {/* Error message */}
                        {submitError && (
                            <div
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 11,
                                    color: "#FF3B30",
                                    marginBottom: 16,
                                }}
                            >
                                {submitError}
                            </div>
                        )}

                        {/* Submit button */}
                        <button
                            ref={submitRef}
                            type="submit"
                            disabled={!agreed || loading}
                            className="magnetic"
                            style={{
                                width: "100%",
                                height: 60,
                                background: agreed && !loading ? "#FF3B30" : "#111",
                                color: agreed && !loading ? "#000" : "#333",
                                fontFamily: "var(--font-syne)",
                                fontWeight: 900,
                                fontSize: 15,
                                letterSpacing: 3,
                                textTransform: "uppercase",
                                border: "none",
                                cursor: agreed && !loading ? "pointer" : "not-allowed",
                                transition: "all 0.3s ease",
                                position: "relative",
                                overflow: "hidden",
                                opacity: loading ? 0.7 : 1,
                            }}
                            onMouseEnter={(e) => {
                                if (!agreed || loading) return;
                                e.currentTarget.style.background = "#cc2f26";
                            }}
                            onMouseLeave={(e) => {
                                if (!agreed || loading) return;
                                e.currentTarget.style.background = "#FF3B30";
                            }}
                        >
                            {loading ? "SENDING..." : "SUBMIT APPLICATION"}
                        </button>
                    </form>
                )}
            </div>

            <style jsx>{`
                .form-grid-2col {
                    grid-template-columns: 1fr 1fr;
                }
                @media (max-width: 768px) {
                    .joinus-section {
                        padding: 80px 5vw !important;
                    }
                    .form-grid-2col {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </section>
    );
}
