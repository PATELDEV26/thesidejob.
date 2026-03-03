"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export default function IdeasPage() {
    const { user, profile, setProfile, loading } = useAuth();
    const router = useRouter();

    const [emailStr, setEmailStr] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [phone, setPhone] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Username setup states (for new users without a profile)
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [isSettingUsername, setIsSettingUsername] = useState(false);

    const handleLoginRedirect = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/login");
    };

    const handleSetUsername = async () => {
        if (!username.trim()) {
            setUsernameError("Please enter a username.");
            return;
        }
        if (/\s/.test(username)) {
            setUsernameError("Username cannot contain spaces.");
            return;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setUsernameError("Only letters, numbers, and underscores allowed.");
            return;
        }
        setIsSettingUsername(true);
        setUsernameError("");

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            setUsernameError("Authentication session lost. Please reload.");
            setIsSettingUsername(false);
            return;
        }

        const { data: existing } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username.trim())
            .single();

        if (existing) {
            setUsernameError('Username already taken. Choose another.');
            setIsSettingUsername(false);
            return;
        }

        const { error: insertError } = await supabase.from("profiles").upsert([{
            id: session.user.id,
            username: username.trim(),
            email: session.user.email
        }], { onConflict: 'id' });

        setIsSettingUsername(false);

        if (insertError) {
            if (insertError.code === "23505") {
                setUsernameError("This username is already taken.");
            } else {
                setUsernameError(`Failed to create profile: ${insertError.message || insertError.code}`);
            }
            return;
        }

        // Profile created — update local state
        setProfile({ id: session.user.id, username: username.trim(), email: session.user.email });
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

    // Determine state: not logged in, logged in but no profile, or fully set up
    const isLoggedIn = !!user;
    const hasProfile = !!profile;

    return (
        <div style={{ background: "#000", minHeight: "100vh", paddingTop: "120px", paddingBottom: "120px" }}>
            {!isLoggedIn ? (
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

                    <form onSubmit={handleLoginRedirect} style={{ maxWidth: 400, margin: "0 auto" }}>
                        <button
                            type="submit"
                            style={{
                                background: "#FF3B30",
                                color: "#000",
                                fontFamily: "var(--font-syne)",
                                fontWeight: 900,
                                fontSize: 14,
                                padding: "18px 36px",
                                border: "none",
                                cursor: "pointer",
                                marginTop: 32,
                                textTransform: "uppercase",
                                letterSpacing: 2
                            }}
                        >
                            Log In To Drop Idea →
                        </button>
                    </form>
                </div>
            ) : !hasProfile ? (
                // LOGGED IN BUT NO USERNAME/PROFILE YET
                <div style={{ padding: "0 8vw", textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
                    <div style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 11, color: "#FF3B30", letterSpacing: 4, textTransform: "uppercase", marginBottom: 24 }}>
                        // ALMOST THERE
                    </div>
                    <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: "clamp(36px, 5vw, 64px)", color: "#fff", lineHeight: 1, margin: "0 0 16px" }}>
                        Choose your username<span style={{ color: "#FF3B30" }}>.</span>
                    </h1>
                    <p style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 13, color: "#555", maxWidth: 460, margin: "0 auto 48px", lineHeight: 1.6 }}>
                        This is how you'll be known across Thesidejob.<br />
                        <strong style={{ color: "#FF3B30" }}>Note: This cannot be changed later.</strong>
                    </p>

                    <div style={{ maxWidth: 400, margin: "0 auto" }}>
                        {usernameError && (
                            <div style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 12, color: "#FF3B30", marginBottom: 16, textAlign: "left" }}>
                                {usernameError}
                            </div>
                        )}
                        <input
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") handleSetUsername(); }}
                            placeholder="your username"
                            style={{
                                width: "100%", background: "#0a0a0a", border: "1px solid #1a1a1a", color: "#fff",
                                fontFamily: "var(--font-space-mono), monospace", fontSize: 14, padding: "16px 20px",
                                outline: "none", boxSizing: "border-box", transition: "border-color 0.3s", marginBottom: 16
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = "#FF3B30"}
                            onBlur={e => e.currentTarget.style.borderColor = "#1a1a1a"}
                        />
                        <button
                            onClick={handleSetUsername}
                            disabled={isSettingUsername || !username.trim()}
                            style={{
                                width: "100%", background: "#FF3B30", color: "#000",
                                fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: 14,
                                padding: "18px 36px", border: "none",
                                cursor: (isSettingUsername || !username.trim()) ? "not-allowed" : "pointer",
                                textTransform: "uppercase", letterSpacing: 2,
                                opacity: (isSettingUsername || !username.trim()) ? 0.7 : 1
                            }}
                        >
                            {isSettingUsername ? "Saving..." : "Lock in Username →"}
                        </button>
                    </div>
                </div>
            ) : (
                // FULLY LOGGED IN STATE — SHOW IDEA FORM
                <div className="ideas-page-wrapper" style={{ padding: "0 8vw" }}>
                    <div style={{ textAlign: "center", marginBottom: 64 }}>
                        <div style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 11, color: "#FF3B30", letterSpacing: 4, textTransform: "uppercase", marginBottom: 24 }}>
                            // SHARE YOUR VISION
                        </div>
                        <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: "clamp(48px, 7vw, 96px)", color: "#fff", lineHeight: 1, margin: 0 }}>
                            Got a crazy Idea<span style={{ color: "#FF3B30" }}>?</span>
                        </h1>
                    </div>

                    <div className="ideas-form-card" style={{ maxWidth: 680, width: "100%", margin: "0 auto", background: "#0a0a0a", border: "1px solid #1a1a1a", padding: "48px", boxSizing: "border-box" }}>
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
            <style jsx>{`
                @media (max-width: 768px) {
                    .ideas-page-wrapper {
                        padding: 0 16px !important;
                    }
                    .ideas-form-card {
                        padding: 24px !important;
                        max-width: 100% !important;
                    }
                }
            `}</style>
        </div>
    );
}
