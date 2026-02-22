"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const AVATAR_STYLES = [
    { id: "avataaars", label: "Avataaars", desc: "Classic cartoon style" },
    { id: "pixel-art", label: "Pixels", desc: "Retro pixel art" },
    { id: "bottts", label: "Bots", desc: "Robot avatars" },
    { id: "adventurer", label: "Adventurer", desc: "Adventure characters" },
    { id: "big-ears", label: "Big Ears", desc: "Cute big-eared faces" },
    { id: "lorelei", label: "Lorelei", desc: "Minimalist line art" },
    { id: "thumbs", label: "Thumbs", desc: "Thumbs up characters" },
    { id: "fun-emoji", label: "Fun Emoji", desc: "Expressive emojis" },
    { id: "icons", label: "Icons", desc: "Simple icon style" },
];

export default function ProfilePage() {
    const router = useRouter();
    const [session, setSession] = useState<any>(null);
    const [selectedStyle, setSelectedStyle] = useState("avataaars");
    const [savedStyle, setSavedStyle] = useState("avataaars");
    const [displayName, setDisplayName] = useState("");
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // Get session
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.push("/login");
                return;
            }
            setSession(session);
            setDisplayName(
                session.user.user_metadata?.full_name || session.user.email || ""
            );
            // Fetch existing profile
            fetchProfile(session.user.id);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (!session) router.push("/login");
        });
        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from("profiles")
            .select("avatar_style, display_name")
            .eq("id", userId)
            .single();

        if (data) {
            if (data.avatar_style) {
                setSelectedStyle(data.avatar_style);
                setSavedStyle(data.avatar_style);
            }
            if (data.display_name) {
                setDisplayName(data.display_name);
            }
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!session) return;
        setSaving(true);
        setError("");
        setSuccess("");

        const profileData = {
            id: session.user.id,
            avatar_style: selectedStyle,
            display_name: displayName.trim() || session.user.email,
            avatar_url: `https://api.dicebear.com/9.x/${selectedStyle}/svg?seed=${encodeURIComponent(
                displayName.trim() || session.user.email || session.user.id
            )}`,
            updated_at: new Date().toISOString(),
        };

        const { error: upsertError } = await supabase
            .from("profiles")
            .upsert(profileData, { onConflict: "id" });

        if (upsertError) {
            setError(upsertError.message);
        } else {
            setSavedStyle(selectedStyle);
            setSuccess("Profile saved!");
            setTimeout(() => setSuccess(""), 3000);
        }
        setSaving(false);
    };

    const seed = encodeURIComponent(
        displayName.trim() || session?.user?.email || "user"
    );

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "#555",
                }}
            >
                Loading...
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#000",
                padding: "32px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {/* Top nav */}
            <div
                style={{
                    width: "100%",
                    maxWidth: 720,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 48,
                }}
            >
                <Link
                    href="/community"
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: 2,
                        color: "#555",
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#FF3B30")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#555")
                    }
                >
                    ← BACK TO CHARCHA
                </Link>
                <Link
                    href="/"
                    style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 900,
                        fontSize: 16,
                        color: "#fff",
                        textDecoration: "none",
                    }}
                >
                    Thesidejob
                    <span style={{ color: "#FF3B30" }}>.</span>
                </Link>
            </div>

            {/* Profile Card */}
            <div
                style={{
                    width: "100%",
                    maxWidth: 720,
                    background: "#050505",
                    border: "1px solid #111",
                    padding: "48px 40px",
                }}
            >
                {/* Header with preview */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 24,
                        marginBottom: 40,
                        flexWrap: "wrap",
                    }}
                >
                    <div
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            overflow: "hidden",
                            background: "#111",
                            border: "3px solid #FF3B30",
                            flexShrink: 0,
                        }}
                    >
                        <img
                            src={`https://api.dicebear.com/9.x/${selectedStyle}/svg?seed=${seed}`}
                            alt="avatar preview"
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    </div>
                    <div>
                        <div
                            style={{
                                fontFamily: "var(--font-syne)",
                                fontWeight: 800,
                                fontSize: 24,
                                color: "#fff",
                                marginBottom: 4,
                            }}
                        >
                            Your Profile
                        </div>
                        <div
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 11,
                                color: "#444",
                                letterSpacing: 1,
                            }}
                        >
                            {session?.user?.email}
                        </div>
                    </div>
                </div>

                {/* Display name */}
                <div style={{ marginBottom: 32 }}>
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
                        DISPLAY NAME
                    </label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your name"
                        style={{
                            width: "100%",
                            maxWidth: 360,
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
                        onFocus={(e) =>
                            (e.currentTarget.style.borderColor =
                                "rgba(255,59,48,0.4)")
                        }
                        onBlur={(e) =>
                            (e.currentTarget.style.borderColor = "#1a1a1a")
                        }
                    />
                </div>

                {/* Avatar Style Picker */}
                <div style={{ marginBottom: 32 }}>
                    <label
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            letterSpacing: 2,
                            color: "#555",
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: 16,
                        }}
                    >
                        CHOOSE AVATAR STYLE
                    </label>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(140px, 1fr))",
                            gap: 12,
                        }}
                    >
                        {AVATAR_STYLES.map((style) => (
                            <div
                                key={style.id}
                                onClick={() => setSelectedStyle(style.id)}
                                style={{
                                    background:
                                        selectedStyle === style.id
                                            ? "#111"
                                            : "#0a0a0a",
                                    border: `2px solid ${
                                        selectedStyle === style.id
                                            ? "#FF3B30"
                                            : "#1a1a1a"
                                    }`,
                                    padding: 16,
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 10,
                                    transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedStyle !== style.id) {
                                        e.currentTarget.style.borderColor =
                                            "#333";
                                        e.currentTarget.style.background =
                                            "#0d0d0d";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedStyle !== style.id) {
                                        e.currentTarget.style.borderColor =
                                            "#1a1a1a";
                                        e.currentTarget.style.background =
                                            "#0a0a0a";
                                    }
                                }}
                            >
                                <div
                                    style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        background: "#111",
                                    }}
                                >
                                    <img
                                        src={`https://api.dicebear.com/9.x/${style.id}/svg?seed=${seed}`}
                                        alt={style.label}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    />
                                </div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-syne)",
                                        fontWeight: 700,
                                        fontSize: 12,
                                        color:
                                            selectedStyle === style.id
                                                ? "#fff"
                                                : "#888",
                                        textAlign: "center",
                                    }}
                                >
                                    {style.label}
                                </div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: 9,
                                        color: "#444",
                                        textAlign: "center",
                                    }}
                                >
                                    {style.desc}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div
                        style={{
                            background: "rgba(255,59,48,0.1)",
                            border: "1px solid rgba(255,59,48,0.3)",
                            padding: "10px 16px",
                            marginBottom: 16,
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
                            marginBottom: 16,
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: "#32D74B",
                        }}
                    >
                        {success}
                    </div>
                )}

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        padding: "14px 40px",
                        background: saving ? "#333" : "#FF3B30",
                        border: "none",
                        color: saving ? "#666" : "#000",
                        fontFamily: "var(--font-syne)",
                        fontWeight: 800,
                        fontSize: 14,
                        letterSpacing: 1,
                        cursor: saving ? "not-allowed" : "pointer",
                        transition: "opacity 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        if (!saving) e.currentTarget.style.opacity = "0.85";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                    }}
                >
                    {saving ? "SAVING..." : "SAVE PROFILE"}
                </button>

                {/* Preview how it looks in chat */}
                <div style={{ marginTop: 40, borderTop: "1px solid #111", paddingTop: 24 }}>
                    <div
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            letterSpacing: 2,
                            color: "#333",
                            textTransform: "uppercase",
                            marginBottom: 16,
                        }}
                    >
                        PREVIEW IN CHAT
                    </div>
                    <div
                        style={{
                            display: "flex",
                            gap: 16,
                            padding: "12px 0",
                            background: "rgba(255,255,255,0.02)",
                            borderRadius: 4,
                            paddingLeft: 12,
                        }}
                    >
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                overflow: "hidden",
                                background: "#111",
                                flexShrink: 0,
                            }}
                        >
                            <img
                                src={`https://api.dicebear.com/9.x/${selectedStyle}/svg?seed=${seed}`}
                                alt="preview"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "50%",
                                }}
                            />
                        </div>
                        <div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    gap: 8,
                                    marginBottom: 4,
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "var(--font-syne)",
                                        fontWeight: 700,
                                        fontSize: 14,
                                        color: "#fff",
                                    }}
                                >
                                    {displayName || "You"}
                                </span>
                                <span
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: 10,
                                        color: "#333",
                                    }}
                                >
                                    12:00 PM
                                </span>
                            </div>
                            <div
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 13,
                                    color: "#ccc",
                                    lineHeight: 1.7,
                                }}
                            >
                                This is how your messages will look in Charcha! 🚀
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
