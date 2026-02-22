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

const QUICK_EMOJIS = ["😀", "😂", "🔥", "❤️", "👍", "👎", "🎉", "🚀", "💯", "👀", "🤔", "😎", "🙌", "✅", "❌", "💀"];

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
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const [onlineCount, setOnlineCount] = useState(0);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            setOnlineCount(session ? 1 : 0);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setOnlineCount(session ? 1 : 0);
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

        const currentName = session.user.user_metadata?.full_name || session.user.email || "User";

        const content = input.trim();
        setInput(""); // CRITICAL: Clear input field immediately
        setEmojiPickerOpen(false);

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
                    onClick={() => { if (!session) window.location.href = "/login"; }}
                    style={{
                        padding: "24px 20px",
                        borderBottom: "1px solid #111",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        cursor: session ? "default" : "pointer",
                        transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => { if (!session) e.currentTarget.style.background = "#0d0d0d"; }}
                    onMouseLeave={(e) => { if (!session) e.currentTarget.style.background = "transparent"; }}
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
                            <div
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #FF3B30, #7a0000)",
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
                                {getInitials(session.user.user_metadata?.full_name || session.user.email || "")}
                            </div>
                            <div style={{ flex: 1, overflow: "hidden" }}>
                                <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 13, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {session.user.user_metadata?.full_name || session.user.email}
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
                        <a
                            href="/login"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                cursor: "pointer",
                                textDecoration: "none",
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
                        </a>
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
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: onlineCount > 0 ? "#32D74B" : "#333" }} />
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#555" }}>
                                {onlineCount}
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
                                            background: (session && msg.sender === (session.user.user_metadata?.full_name || session.user.email))
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
                            {/* Hidden file input for attachment */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setInput((prev) => prev + ` [📎 ${file.name}]`);
                                        inputRef.current?.focus();
                                    }
                                    e.target.value = "";
                                }}
                            />
                            {/* Attachment icon */}
                            <svg
                                width="20" height="20" viewBox="0 0 20 20" fill="none"
                                style={{ color: "#333", cursor: "pointer", transition: "color 0.15s ease" }}
                                onClick={() => fileInputRef.current?.click()}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B30")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
                            >
                                <path d="M17 10l-7.5 7.5a5 5 0 01-7-7L10 3a3.33 3.33 0 014.7 4.7l-7.5 7.5a1.67 1.67 0 01-2.3-2.3L12.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            {/* Emoji icon */}
                            <div style={{ position: "relative" }}>
                                <svg
                                    width="20" height="20" viewBox="0 0 20 20" fill="none"
                                    style={{ color: emojiPickerOpen ? "#FF3B30" : "#333", cursor: "pointer", transition: "color 0.15s ease" }}
                                    onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B30")}
                                    onMouseLeave={(e) => { if (!emojiPickerOpen) e.currentTarget.style.color = "#333"; }}
                                >
                                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M7 12s1 2 3 2 3-2 3-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <circle cx="7.5" cy="8.5" r="0.5" fill="currentColor" />
                                    <circle cx="12.5" cy="8.5" r="0.5" fill="currentColor" />
                                </svg>
                                {emojiPickerOpen && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: 36,
                                            right: 0,
                                            background: "#0d0d0d",
                                            border: "1px solid #1e1e1e",
                                            padding: 12,
                                            display: "grid",
                                            gridTemplateColumns: "repeat(4, 1fr)",
                                            gap: 4,
                                            zIndex: 50,
                                            width: 200,
                                        }}
                                    >
                                        {QUICK_EMOJIS.map((emoji) => (
                                            <button
                                                key={emoji}
                                                onClick={() => {
                                                    setInput((prev) => prev + emoji);
                                                    setEmojiPickerOpen(false);
                                                    inputRef.current?.focus();
                                                }}
                                                style={{
                                                    background: "transparent",
                                                    border: "1px solid transparent",
                                                    fontSize: 20,
                                                    cursor: "pointer",
                                                    padding: "6px",
                                                    borderRadius: 4,
                                                    transition: "all 0.1s ease",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = "#111";
                                                    e.currentTarget.style.borderColor = "#333";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = "transparent";
                                                    e.currentTarget.style.borderColor = "transparent";
                                                }}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
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
                        <div
                            style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                            }}
                        >
                            <div
                                style={{
                                    flex: 1,
                                    background: "#0a0a0a",
                                    border: "1px solid #1a1a1a",
                                    padding: "14px 20px",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 13,
                                    color: "#333",
                                    cursor: "default",
                                    userSelect: "none",
                                    opacity: 0.5,
                                }}
                            >
                                Message #{activeChannel}
                            </div>
                            <a
                                href="/login"
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 11,
                                    color: "#FF3B30",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    textDecoration: "underline",
                                    textUnderlineOffset: 3,
                                    transition: "opacity 0.2s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                            >
                                Please log in
                            </a>
                        </div>
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
                {session ? (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "8px 0",
                        }}
                    >
                        <div style={{ position: "relative" }}>
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #FF3B30, #7a0000)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontFamily: "var(--font-syne)",
                                    fontWeight: 900,
                                    fontSize: 10,
                                    color: "#fff",
                                }}
                            >
                                {getInitials(session.user.user_metadata?.full_name || session.user.email || "")}
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
                                {session.user.user_metadata?.full_name || session.user.email}
                            </div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#444" }}>
                                Online
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: "#333",
                            padding: "8px 0",
                        }}
                    >
                        No one online
                    </div>
                )}

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