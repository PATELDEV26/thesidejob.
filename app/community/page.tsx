"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// CRITICAL: Initialize Supabase OUTSIDE the React component to prevent re-renders dropping connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CHANNELS = [
    { name: "general", desc: "The main channel for all things Thesidejob" },
    { name: "build-logs", desc: "Share what you're shipping" },
    { name: "hacks", desc: "Quick hacks and clever tricks" },
    { name: "ideas", desc: "Brainstorm and validate ideas" },
    { name: "launches", desc: "Announce your launches 🚀" },
    { name: "feedback", desc: "Get feedback from the community" },
    { name: "random", desc: "Off-topic, memes, and vibes" },
];

const ONLINE_MEMBERS = [
    { name: "dhariya", role: "Co-Founder", avatar: "DP" },
    { name: "dev", role: "Co-Founder", avatar: "DP" },
    { name: "aditya", role: "Co-Founder", avatar: "AG" },
    { name: "harshit", role: "Co-Founder", avatar: "HP" },
    { name: "vansh", role: "Co-Founder", avatar: "VK" },
    { name: "aarav", role: "Full-Stack Dev", avatar: "AA" },
    { name: "priya", role: "Designer", avatar: "PR" },
    { name: "rohan", role: "AI Engineer", avatar: "RO" },
    { name: "neha", role: "Frontend Dev", avatar: "NE" },
    { name: "arjun", role: "Backend Dev", avatar: "AR" },
    { name: "sara", role: "Product Manager", avatar: "SA" },
    { name: "karan", role: "Growth Hacker", avatar: "KA" },
];

const DM_USERS = [
    { name: "dhariya", online: true },
    { name: "dev", online: true },
    { name: "aditya", online: false },
    { name: "priya", online: true },
    { name: "rohan", online: true },
];

interface Message {
    id: string;
    sender: string;
    avatar: string;
    text: string;
    time: string;
    reactions?: { emoji: string; count: number }[];
}

function formatCode(text: string): React.ReactNode {
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`")) {
            return (
                <code
                    key={i}
                    style={{
                        background: "#111",
                        border: "1px solid #1e1e1e",
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "#00ff88",
                        padding: "2px 8px",
                    }}
                >
                    {part.slice(1, -1)}
                </code>
            );
        }
        return part;
    });
}

export default function CommunityPage() {
    const [activeChannel, setActiveChannel] = useState("general");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [session, setSession] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const scrollToBottom = useCallback(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const getInitials = (name: string) => {
        if (!name) return "??";
        return name.slice(0, 2).toUpperCase();
    };

    // Fetch initial session & listen for auth changes
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({ provider: 'google' });
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    // Load existing messages and setup "Short-Polling" Fallback
    useEffect(() => {
        const fetchExistingMessages = async () => {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .order("created_at", { ascending: true });

            if (data) {
                const formatted = data.map((m: any) => ({
                    id: m.id,
                    sender: m.sender_name || "Anonymous",
                    avatar: getInitials(m.sender_name || "A"),
                    text: m.content || "",
                    time: new Date(m.created_at).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                    }),
                }));
                setMessages(formatted);
            }
            if (error) console.error("Fetch error:", error);
        };

        // 1. Fetch immediately on page load
        fetchExistingMessages();

        // 2. THE BULLETPROOF FIX: Short-Polling
        // Fetch the database every 2 seconds. This bypasses Kaspersky, strict firewalls, 
        // and WSS bugs, guaranteeing the chat feels "live" for every single user.
        const pollInterval = setInterval(() => {
            fetchExistingMessages();
        }, 2000);

        // 3. Clean up the interval when leaving the page
        return () => {
            clearInterval(pollInterval);
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const sendMessage = async () => {
        if (!input.trim() || !session) return;

        const currentName = session.user.user_metadata.full_name || "Anonymous";

        const content = input.trim();
        setInput(""); // CRITICAL: Clear input field immediately

        const { error } = await supabase.from("messages").insert([
            {
                content,
                sender_name: currentName,
            },
        ]);

        if (error) {
            console.error("Error sending message:", error);
        } else {
            // Optional: Instantly fetch right after sending to make it feel even faster
            const { data } = await supabase
                .from("messages")
                .select("*")
                .order("created_at", { ascending: true });

            if (data) {
                const formatted = data.map((m: any) => ({
                    id: m.id,
                    sender: m.sender_name || "Anonymous",
                    avatar: getInitials(m.sender_name || "A"),
                    text: m.content || "",
                    time: new Date(m.created_at).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                    }),
                }));
                setMessages(formatted);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const activeChannelData = CHANNELS.find((c) => c.name === activeChannel);

    return (
        <div style={{ display: "flex", height: "100vh", background: "#000", overflow: "hidden", position: "relative" }}>
            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    onClick={toggleSidebar}
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.5)",
                        backdropFilter: "blur(4px)",
                        zIndex: 100,
                    }}
                />
            )}

            {/* ─── Left Sidebar ─── */}
            <div
                className={`left-sidebar ${sidebarOpen ? "open" : ""}`}
                style={{
                    width: 280,
                    background: "#050505",
                    borderRight: "1px solid #111",
                    display: "flex",
                    flexDirection: "column",
                    flexShrink: 0,
                    overflow: "hidden",
                    zIndex: 101,
                }}
            >
                {/* Logo area */}
                <div
                    style={{
                        padding: "24px 20px",
                        borderBottom: "1px solid #111",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: "#FF3B30",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            flexShrink: 0,
                            fontFamily: "var(--font-syne)",
                            fontWeight: 900,
                            fontSize: 12,
                            color: "#000",
                        }}
                    >
                        TSJ
                    </div>
                    <div>
                        <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 16, color: "#fff" }}>
                            Charcha
                        </div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#444", letterSpacing: 1 }}>
                            Baat karo. Build karo.
                        </div>
                    </div>
                </div>

                {/* Channels */}
                <div style={{ padding: "20px 0", flex: 1, overflowY: "auto" }}>
                    <div
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            letterSpacing: 3,
                            color: "#333",
                            textTransform: "uppercase",
                            padding: "0 20px",
                            marginBottom: 12,
                        }}
                    >
                        CHANNELS
                    </div>
                    {CHANNELS.map((ch) => (
                        <div
                            key={ch.name}
                            onClick={() => setActiveChannel(ch.name)}
                            style={{
                                padding: "8px 20px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                background: activeChannel === ch.name ? "#111" : "transparent",
                                borderLeft: activeChannel === ch.name ? "2px solid #FF3B30" : "2px solid transparent",
                                color: activeChannel === ch.name ? "#fff" : "#555",
                                fontFamily: "var(--font-mono)",
                                fontSize: 13,
                                transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                                if (activeChannel !== ch.name) {
                                    e.currentTarget.style.background = "#0d0d0d";
                                    e.currentTarget.style.color = "#888";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeChannel !== ch.name) {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = "#555";
                                }
                            }}
                        >
                            <span style={{ color: "#FF3B30", fontWeight: 700 }}>#</span>
                            {ch.name}
                        </div>
                    ))}

                    {/* Direct Messages */}
                    <div
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            letterSpacing: 3,
                            color: "#333",
                            textTransform: "uppercase",
                            padding: "24px 20px 12px",
                        }}
                    >
                        DIRECT
                    </div>
                    {DM_USERS.map((user) => (
                        <div
                            key={user.name}
                            style={{
                                padding: "6px 20px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                fontFamily: "var(--font-mono)",
                                fontSize: 13,
                                color: "#555",
                                transition: "color 0.15s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#888")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                        >
                            <div
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: user.online ? "#32D74B" : "#333",
                                    flexShrink: 0,
                                }}
                            />
                            {user.name}
                        </div>
                    ))}
                </div>

                {/* Bottom user */}
                <div
                    style={{
                        padding: "16px 20px",
                        borderTop: "1px solid #111",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    {session ? (
                        <>
                            <img
                                src={session.user.user_metadata.avatar_url}
                                alt="avatar"
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    flexShrink: 0,
                                }}
                            />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 13, color: "#fff" }}>
                                    {session.user.user_metadata.full_name}
                                </div>
                            </div>
                            <div
                                onClick={handleLogout}
                                style={{
                                    marginLeft: "auto",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 10,
                                    color: "#555",
                                    cursor: "pointer",
                                    transition: "color 0.2s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B30")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                            >
                                Log out
                            </div>
                        </>
                    ) : (
                        <div
                            onClick={handleGoogleLogin}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                cursor: "pointer",
                            }}
                        >
                            <div
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    background: "#111",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontFamily: "var(--font-syne)",
                                    fontWeight: 900,
                                    fontSize: 10,
                                    color: "#555",
                                }}
                            >
                                ??
                            </div>
                            <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 13, color: "#555" }}>
                                Sign in
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ─── Main Chat Area ─── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh" }}>
                {/* Chat Header */}
                <div
                    style={{
                        height: 64,
                        background: "#050505",
                        borderBottom: "1px solid #111",
                        padding: "0 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        flexShrink: 0,
                    }}
                >
                    {/* Mobile Hamburger */}
                    <button
                        className="mobile-sidebar-toggle"
                        onClick={toggleSidebar}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#fff",
                            cursor: "pointer",
                            padding: 8,
                            display: "none",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>

                    <span style={{ color: "#FF3B30", fontSize: 18, fontWeight: 700 }}>#</span>
                    <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 16, color: "#fff" }}>
                        {activeChannel}
                    </span>
                    <div className="header-divider" style={{ width: 1, height: 20, background: "#222" }} />
                    <span className="channel-desc" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#444" }}>
                        {activeChannelData?.desc}
                    </span>

                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
                        <div className="online-indicator" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#32D74B" }} />
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#555" }}>
                                12
                            </span>
                        </div>
                        {/* Search icon */}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "#333", cursor: "pointer" }}>
                            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>

                    {/* Back to home */}
                    <Link
                        href="/"
                        className="back-to-home"
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: "#555",
                            textDecoration: "none",
                            letterSpacing: 1,
                            transition: "color 0.2s ease",
                            marginLeft: 8,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B30")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                    >
                        <span className="back-text">← TSJ</span>
                    </Link>
                </div>

                {/* Messages */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "0 32px 32px",
                    }}
                    className="chat-messages"
                >
                    {messages.map((msg, i) => {
                        const isNewSender = i === 0 || messages[i - 1].sender !== msg.sender;
                        return (
                            <div
                                key={msg.id}
                                className="chat-msg"
                                style={{
                                    display: "flex",
                                    gap: 16,
                                    padding: isNewSender ? "16px 0 4px" : "4px 0",
                                    paddingLeft: isNewSender ? 0 : 52,
                                    transition: "background 0.15s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                                {isNewSender && (
                                    <div
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: "50%",
                                            background: (session && msg.sender === session.user.user_metadata.full_name)
                                                ? "linear-gradient(135deg, #FF3B30, #7a0000)"
                                                : `linear-gradient(135deg, #${Math.abs(msg.sender.charCodeAt(0) * 123456).toString(16).slice(0, 6)}, #333)`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontFamily: "var(--font-syne)",
                                            fontWeight: 900,
                                            fontSize: 10,
                                            color: "#fff",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {msg.avatar}
                                    </div>
                                )}
                                <div style={{ flex: 1 }}>
                                    {isNewSender && (
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                                            <span
                                                style={{
                                                    fontFamily: "var(--font-syne)",
                                                    fontWeight: 700,
                                                    fontSize: 14,
                                                    color: "#fff",
                                                }}
                                            >
                                                {msg.sender}
                                            </span>
                                            <span
                                                style={{
                                                    fontFamily: "var(--font-mono)",
                                                    fontSize: 10,
                                                    color: "#333",
                                                }}
                                            >
                                                {msg.time}
                                            </span>
                                        </div>
                                    )}
                                    <div
                                        style={{
                                            fontFamily: "var(--font-mono)",
                                            fontSize: 13,
                                            color: "#ccc",
                                            lineHeight: 1.7,
                                        }}
                                    >
                                        {formatCode(msg.text)}
                                    </div>
                                    {msg.reactions && msg.reactions.length > 0 && (
                                        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                                            {msg.reactions.map((r, ri) => (
                                                <span
                                                    key={ri}
                                                    style={{
                                                        background: "#111",
                                                        border: "1px solid #1e1e1e",
                                                        padding: "2px 8px",
                                                        fontSize: 12,
                                                        fontFamily: "var(--font-mono)",
                                                        color: "#888",
                                                        cursor: "pointer",
                                                        transition: "border-color 0.15s ease",
                                                    }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#FF3B30")}
                                                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
                                                >
                                                    {r.emoji} {r.count}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={chatEndRef} />
                </div>

                {/* Message Input */}
                <div
                    style={{
                        height: 80,
                        background: "#050505",
                        borderTop: "1px solid #111",
                        padding: "0 32px",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        flexShrink: 0,
                    }}
                >
                    {session ? (
                        <>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={`Message #${activeChannel}`}
                                style={{
                                    flex: 1,
                                    background: "#111",
                                    border: "1px solid #1a1a1a",
                                    color: "#fff",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 13,
                                    padding: "14px 20px",
                                    outline: "none",
                                    transition: "border-color 0.2s ease",
                                }}
                                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,59,48,0.4)")}
                                onBlur={(e) => (e.currentTarget.style.borderColor = "#1a1a1a")}
                            />
                            {/* Attachment icon */}
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: "#333", cursor: "pointer" }}>
                                <path d="M17 10l-7.5 7.5a5 5 0 01-7-7L10 3a3.33 3.33 0 014.7 4.7l-7.5 7.5a1.67 1.67 0 01-2.3-2.3L12.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            {/* Emoji icon */}
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: "#333", cursor: "pointer" }}>
                                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M7 12s1 2 3 2 3-2 3-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <circle cx="7.5" cy="8.5" r="0.5" fill="currentColor" />
                                <circle cx="12.5" cy="8.5" r="0.5" fill="currentColor" />
                            </svg>
                            {/* Send button */}
                            <button
                                onClick={sendMessage}
                                style={{
                                    width: 36,
                                    height: 36,
                                    background: input.trim() ? "#FF3B30" : "#111",
                                    border: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: input.trim() ? "pointer" : "default",
                                    transition: "background 0.2s ease",
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M14 2L7 9" stroke={input.trim() ? "#000" : "#333"} strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M14 2L9.5 14.5L7 9L1.5 6.5L14 2Z" stroke={input.trim() ? "#000" : "#333"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleGoogleLogin}
                            style={{
                                width: "100%",
                                height: 48,
                                background: "linear-gradient(135deg, #FF3B30, #b71c1c)",
                                border: "none",
                                borderRadius: 0,
                                color: "#fff",
                                fontFamily: "var(--font-syne)",
                                fontWeight: 800,
                                fontSize: 14,
                                letterSpacing: 1,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 10,
                                transition: "opacity 0.2s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                        >
                            <svg width="18" height="18" viewBox="0 0 48 48">
                                <path fill="#fff" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
                            </svg>
                            Sign in with Google to Chat
                        </button>
                    )}
                </div>
            </div>

            {/* ─── Right Sidebar ─── */}
            <div
                style={{
                    width: 220,
                    background: "#050505",
                    borderLeft: "1px solid #111",
                    padding: "24px 16px",
                    overflowY: "auto",
                    flexShrink: 0,
                }}
                className="right-sidebar"
            >
                <div
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: 3,
                        color: "#333",
                        textTransform: "uppercase",
                        marginBottom: 16,
                    }}
                >
                    ONLINE NOW
                </div>
                {ONLINE_MEMBERS.map((member) => (
                    <div
                        key={member.name}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "8px 0",
                            cursor: "pointer",
                        }}
                    >
                        <div style={{ position: "relative" }}>
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    background: `linear-gradient(135deg, #${Math.abs(member.name.charCodeAt(0) * 123456).toString(16).slice(0, 6)}, #333)`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontFamily: "var(--font-syne)",
                                    fontWeight: 900,
                                    fontSize: 10,
                                    color: "#fff",
                                }}
                            >
                                {member.avatar}
                            </div>
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    background: "#32D74B",
                                    border: "2px solid #050505",
                                }}
                            />
                        </div>
                        <div>
                            <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 13, color: "#fff" }}>
                                {member.name}
                            </div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#444" }}>
                                {member.role}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Build Sprint Event */}
                <div
                    style={{
                        marginTop: 32,
                        background: "#0d0d0d",
                        border: "1px solid #1e1e1e",
                        borderLeft: "3px solid #FF3B30",
                        padding: 16,
                    }}
                >
                    <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 14, color: "#fff", marginBottom: 8 }}>
                        BUILD SPRINT
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#FF3B30", marginBottom: 4 }}>
                        FEB 22 — FEB 24
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#444", marginBottom: 12 }}>
                        Thesidejob HQ, Vadodara
                    </div>
                    <button
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            letterSpacing: 2,
                            color: "#FF3B30",
                            background: "transparent",
                            border: "1px solid #FF3B30",
                            padding: "6px 12px",
                            cursor: "pointer",
                            textTransform: "uppercase",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#FF3B30";
                            e.currentTarget.style.color = "#000";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#FF3B30";
                        }}
                    >
                        RSVP
                    </button>
                </div>
            </div>

            <style jsx>{`
                .chat-messages::-webkit-scrollbar {
                    width: 4px;
                }
                .chat-messages::-webkit-scrollbar-track {
                    background: #111;
                }
                .chat-messages::-webkit-scrollbar-thumb {
                    background: #222;
                }
                .chat-messages::-webkit-scrollbar-thumb:hover {
                    background: #FF3B30;
                }
                @media (max-width: 900px) {
                    .right-sidebar {
                        display: none;
                    }
                    .back-text {
                        display: none;
                    }
                }
                @media (max-width: 768px) {
                    .left-sidebar {
                        position: absolute !important;
                        left: -280px;
                        top: 0;
                        bottom: 0;
                        transition: transform 0.3s ease !important;
                    }
                    .left-sidebar.open {
                        transform: translateX(280px);
                    }
                    .mobile-sidebar-toggle {
                        display: flex !important;
                    }
                    .channel-desc {
                        display: none;
                    }
                    .header-divider {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}