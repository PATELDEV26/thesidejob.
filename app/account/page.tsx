"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

export default function AccountPage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await supabase.auth.signOut();
        router.push("/");
    };

    if (loading || !user) {
        return <div style={{ background: "#000", height: "100vh" }} />;
    }

    return (
        <div style={{ background: "#000", minHeight: "100vh", position: "relative", paddingTop: "140px", paddingBottom: "120px" }}>
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

            <div style={{ padding: "0 8vw", maxWidth: 600, margin: "0 auto", textAlign: "left" }}>
                <div style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 11, color: "#FF3B30", letterSpacing: 4, textTransform: "uppercase", marginBottom: 24 }}>
                    // YOUR PROFILE
                </div>

                <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: "clamp(36px, 5vw, 56px)", color: "#fff", lineHeight: 1, margin: "0 0 48px" }}>
                    Account Details<span style={{ color: "#FF3B30" }}>.</span>
                </h1>

                <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", padding: "40px", display: "flex", flexDirection: "column", gap: 32 }}>
                    <div>
                        <div style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 10, color: "#888", marginBottom: 8, letterSpacing: 1 }}>
                            USERNAME
                        </div>
                        <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 18, color: "#fff" }}>
                            {profile?.username || "Not set"}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 10, color: "#888", marginBottom: 8, letterSpacing: 1 }}>
                            EMAIL
                        </div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "#ccc" }}>
                            {user.email}
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        style={{
                            background: "transparent",
                            border: "1px solid #FF3B30",
                            color: "#FF3B30",
                            fontFamily: "var(--font-syne)",
                            fontWeight: 900,
                            fontSize: 14,
                            padding: "16px",
                            cursor: isLoggingOut ? "not-allowed" : "pointer",
                            marginTop: 16,
                            transition: "all 0.3s ease",
                            textTransform: "uppercase",
                            letterSpacing: 2
                        }}
                        onMouseEnter={(e) => {
                            if (!isLoggingOut) {
                                e.currentTarget.style.background = "#FF3B30";
                                e.currentTarget.style.color = "#000";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isLoggingOut) {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = "#FF3B30";
                            }
                        }}
                    >
                        {isLoggingOut ? "Logging Out..." : "Log Out"}
                    </button>
                </div>
            </div>
        </div>
    );
}
