"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import LoginModal from "@/components/ui/LoginModal";

const QUICK_EMOJIS = ["😀", "😂", "🔥", "❤️", "👍", "👎", "🎉", "🚀", "💯", "👀", "🤔", "😎", "🙌", "✅", "❌", "💀"];

interface Message {
    id: string;
    sender: string;
    avatar: string;
    text: string;
    time: string;
    channel?: string;
    room_id?: string;
}

const SECTIONS = [
    { id: "introduction", label: "#introduction", icon: "👋", desc: "Introduce yourself to the community" },
    { id: "general", label: "#general", icon: "#", desc: "The main channel for all things Thesidejob" }
];

function formatText(text: string, onlineUsers: string[]): React.ReactNode {
    const parts = text.split(/(`[^`]+`|@\w+)/g);
    return parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`")) {
            return (
                <code key={i} style={{
                    background: "#111", border: "1px solid #1e1e1e",
                    fontFamily: "var(--font-mono)", fontSize: 12,
                    color: "#00ff88", padding: "2px 8px",
                }}>{part.slice(1, -1)}</code>
            );
        }
        if (part.startsWith("@")) {
            const name = part.slice(1);
            const isOnline = onlineUsers.some(u => u.toLowerCase() === name.toLowerCase());
            return (
                <span key={i} style={{
                    background: isOnline ? "rgba(255,59,48,0.15)" : "rgba(255,255,255,0.05)",
                    color: isOnline ? "#FF3B30" : "#888",
                    padding: "1px 6px", borderRadius: 4,
                    fontWeight: 700, fontSize: 13,
                }}>{part}</span>
            );
        }
        return part;
    });
}

function getNextFridayAndSunday() {
    const today = new Date();
    const friday = new Date();
    friday.setDate(today.getDate() + ((7 - today.getDay() + 5) % 7 || 7));
    const sunday = new Date(friday);
    sunday.setDate(friday.getDate() + 2);

    const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return `${friday.toLocaleDateString("en-US", opts).toUpperCase()} — ${sunday.toLocaleDateString("en-US", opts).toUpperCase()}`;
}

export default function CommunityPage() {
    const { user, profile, setProfile, loading, isAdmin } = useAuth();

    const [activeChannel, setActiveChannel] = useState<string>("introduction");
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

    const [privateRooms, setPrivateRooms] = useState<any[]>([]);

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

    // Sidebar & Layout
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Mentions & Presence
    const [showMentions, setShowMentions] = useState(false);
    const [mentionFilter, setMentionFilter] = useState("");
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    // Private Rooms Creation & Joining
    const [showCreateRoom, setShowCreateRoom] = useState(false);
    const [newRoomName, setNewRoomName] = useState("");
    const [newRoomPasscode, setNewRoomPasscode] = useState("");

    const [roomToJoin, setRoomToJoin] = useState<any>(null);
    const [joinPasscode, setJoinPasscode] = useState("");
    const [joinError, setJoinError] = useState("");

    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = useCallback(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const getInitials = (name: string) => name ? name.slice(0, 2).toUpperCase() : "??";

    useEffect(() => {
        const draft = localStorage.getItem("charcha_mention_draft");
        if (draft) {
            setInput(draft);
            localStorage.removeItem("charcha_mention_draft");
        }
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    // Presence
    useEffect(() => {
        if (!profile?.username) return;
        const updatePresence = async () => {
            await supabase.from("online_users").upsert(
                { name: profile.username, last_seen: new Date().toISOString() },
                { onConflict: "name" }
            ).then(() => { });

            const tenSecsAgo = new Date(Date.now() - 10000).toISOString();
            const { data } = await supabase.from("online_users").select("name").gte("last_seen", tenSecsAgo);
            if (data) setOnlineUsers(data.map((u: any) => u.name));
        };
        updatePresence();
        const interval = setInterval(updatePresence, 5000);
        return () => clearInterval(interval);
    }, [profile?.username]);

    // Fetch Private Rooms & Subscribe
    useEffect(() => {
        const fetchRooms = async () => {
            const { data } = await supabase.from("private_rooms").select("*").order("created_at", { ascending: true });
            if (data) setPrivateRooms(data);
        };
        fetchRooms();

        const roomSub = supabase.channel('rooms')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'private_rooms' }, (payload) => {
                setPrivateRooms(prev => [...prev, payload.new]);
            }).subscribe();

        return () => { supabase.removeChannel(roomSub) };
    }, []);

    // Fetch Messages & Subscribe
    useEffect(() => {
        if (!activeChannel && !activeRoomId) return;

        const fetchMessages = async () => {
            let query = supabase.from("messages").select("*").order("created_at", { ascending: true }).limit(100);

            if (activeRoomId) {
                query = query.eq("room_id", activeRoomId);
            } else if (activeChannel === "general") {
                // To fetch both 'general' and null channels (legacy), though ideally all have a channel 
                query = query.or("channel.eq.general,channel.is.null").is("room_id", null);
            } else {
                query = query.eq("channel", activeChannel).is("room_id", null);
            }

            const { data, error } = await query;
            if (data) {
                setMessages(data.map((m: any) => ({
                    id: m.id,
                    sender: m.sender_name || "Anonymous",
                    avatar: getInitials(m.sender_name || "A"),
                    text: m.content || "",
                    time: new Date(m.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
                    channel: m.channel,
                    room_id: m.room_id
                })));
            }
            if (error) console.error("Fetch error:", error);
        };

        fetchMessages();

        const channelFilter = activeRoomId ? `room_id=eq.${activeRoomId}` : `channel=eq.${activeChannel}`;

        const subChannel = supabase
            .channel(`messages:${activeRoomId || activeChannel}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: channelFilter
            }, (payload) => {
                const m = payload.new as any;
                setMessages(prev => [...prev, {
                    id: m.id,
                    sender: m.sender_name || "Anonymous",
                    avatar: getInitials(m.sender_name || "A"),
                    text: m.content || "",
                    time: new Date(m.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
                    channel: m.channel,
                    room_id: m.room_id
                }]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subChannel);
        };
    }, [activeChannel, activeRoomId]);

    useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

    const handleChannelClick = (id: string) => {
        setActiveChannel(id);
        setActiveRoomId(null);
        setSidebarOpen(false);
    };

    const handleRoomClick = (room: any) => {
        if (isAdmin(user?.email)) {
            setActiveRoomId(room.id);
            setActiveChannel("");
            setSidebarOpen(false);
            return;
        }

        const unlocked = localStorage.getItem(`room_${room.id}_unlocked`);
        if (unlocked || room.created_by === profile?.username) {
            setActiveRoomId(room.id);
            setActiveChannel("");
            setSidebarOpen(false);
        } else {
            setRoomToJoin(room);
            setJoinPasscode("");
            setJoinError("");
        }
    };

    const handleJoinSubmit = () => {
        if (joinPasscode === roomToJoin.passcode) {
            localStorage.setItem(`room_${roomToJoin.id}_unlocked`, "true");
            setActiveRoomId(roomToJoin.id);
            setActiveChannel("");
            setSidebarOpen(false);
            setRoomToJoin(null);
        } else {
            setJoinError("Incorrect passcode.");
        }
    };

    const handleCreateRoom = async () => {
        if (!newRoomName.trim() || !newRoomPasscode.trim() || !profile) return;
        const { error } = await supabase.from("private_rooms").insert([{
            name: newRoomName.trim(),
            passcode: newRoomPasscode.trim(),
            created_by: profile.username
        }]);
        if (!error) {
            setShowCreateRoom(false);
            setNewRoomName("");
            setNewRoomPasscode("");
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || !user || !profile?.username) return;
        const content = input.trim();
        setInput("");
        setEmojiPickerOpen(false);
        setShowMentions(false);

        const insertData: any = {
            content,
            sender_name: profile.username
        };

        if (activeRoomId) {
            insertData.room_id = activeRoomId;
        } else {
            insertData.channel = activeChannel;
        }

        const { error } = await supabase.from("messages").insert([insertData]);
        if (error) console.error("Error sending:", error);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInput(val);

        const lastAtIndex = val.lastIndexOf("@");
        if (lastAtIndex !== -1 && lastAtIndex === val.length - 1) {
            setShowMentions(true);
            setMentionFilter("");
        } else if (lastAtIndex !== -1) {
            const afterAt = val.slice(lastAtIndex + 1);
            if (!afterAt.includes(" ")) {
                setShowMentions(true);
                setMentionFilter(afterAt.toLowerCase());
            } else {
                setShowMentions(false);
            }
        } else {
            setShowMentions(false);
        }
    };

    const insertMention = (name: string) => {
        const lastAtIndex = input.lastIndexOf("@");
        const before = input.slice(0, lastAtIndex);
        setInput(before + "@" + name + " ");
        setShowMentions(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const requireAuth = !loading && (!user || !profile);
    const displayName = profile?.username;
    const filteredMentionUsers = onlineUsers.filter(u => u !== displayName).filter(u => !mentionFilter || u.toLowerCase().includes(mentionFilter));

    let activeName = "";
    let activeIcon = "";
    let activeDesc = "";
    if (activeRoomId) {
        const r = privateRooms.find(r => r.id === activeRoomId);
        activeName = r ? r.name : "";
        activeIcon = "🔒";
        activeDesc = r ? `Private room by ${r.created_by}` : "";
    } else {
        const s = SECTIONS.find(s => s.id === activeChannel);
        activeName = s ? s.label : "";
        activeIcon = s ? s.icon : "";
        activeDesc = s ? s.desc : "";
    }

    return (
        <div style={{ display: "flex", height: "100vh", background: "#000", overflow: "hidden", position: "relative" }}>

            {/* LOGIN MODAL */}
            {requireAuth && (
                <LoginModal
                    onSuccess={(newUsername?: string) => {
                        if (newUsername && user) {
                            setProfile({ id: user.id, username: newUsername, email: user.email });
                        }
                    }}
                    onClose={() => {
                        if (!user || !profile) window.location.href = "/";
                    }}
                />
            )}

            {/* JOIN ROOM PROMPT */}
            {roomToJoin && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", zIndex: 9999,
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <div style={{
                        background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: 16, padding: "36px 32px", width: 380, textAlign: "center",
                    }}>
                        <div style={{ fontSize: 32, marginBottom: 16 }}>🔒</div>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: 20, color: "#fff", marginBottom: 6 }}>
                            {roomToJoin.name}
                        </h2>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#555", marginBottom: 24 }}>
                            Enter the passcode to join this private room
                        </p>
                        <input value={joinPasscode} onChange={(e) => { setJoinPasscode(e.target.value); setJoinError(""); }}
                            onKeyDown={(e) => { if (e.key === "Enter") handleJoinSubmit(); }}
                            placeholder="Passcode..." type="password" autoFocus
                            style={{
                                width: "100%", padding: "12px 16px", background: "#111", border: `1px solid ${joinError ? "#FF3B30" : "#222"}`,
                                borderRadius: 8, color: "#fff", fontFamily: "var(--font-mono)", fontSize: 14, outline: "none",
                                marginBottom: joinError ? 8 : 20, boxSizing: "border-box", letterSpacing: 2, textAlign: "center",
                            }}
                        />
                        {joinError && (
                            <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#FF3B30", marginBottom: 16 }}>
                                {joinError}
                            </p>
                        )}
                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={() => setRoomToJoin(null)}
                                style={{
                                    flex: 1, padding: "12px 0", background: "#111", border: "1px solid #222", borderRadius: 8, color: "#888",
                                    fontFamily: "var(--font-mono)", fontSize: 12, cursor: "pointer",
                                }}
                            >Cancel</button>
                            <button onClick={handleJoinSubmit} disabled={!joinPasscode.trim()}
                                style={{
                                    flex: 1, padding: "12px 0", background: joinPasscode.trim() ? "linear-gradient(135deg, #FF3B30, #7a0000)" : "#1a1a1a",
                                    border: "none", borderRadius: 8, color: joinPasscode.trim() ? "#fff" : "#444", fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 12,
                                    cursor: joinPasscode.trim() ? "pointer" : "not-allowed",
                                }}
                            >JOIN ROOM</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)} style={{
                    position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 100,
                }} />
            )}

            {/* ─── Left Sidebar ─── */}
            <div className={`left-sidebar ${sidebarOpen ? "open" : ""}`} style={{
                width: 280, background: "#050505", borderRight: "1px solid #111",
                display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden", zIndex: 101,
            }}>
                <div style={{ padding: "24px 20px", borderBottom: "1px solid #111", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: "50%", background: "#FF3B30",
                        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: 12, color: "#000", flexShrink: 0,
                    }}>TSJ</div>
                    <div>
                        <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 16, color: "#fff" }}>Charcha</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#444", letterSpacing: 1 }}>Baat karo. Build karo.</div>
                    </div>
                </div>

                <div style={{ padding: "20px", flex: 1, overflowY: "auto" }}>
                    {/* BUILD SPRINT BANNER */}
                    <div style={{
                        background: "#0a0a0a", borderLeft: "3px solid #FF3B30", padding: "16px",
                        marginBottom: "24px", position: "relative"
                    }}>
                        <div style={{ fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: 13, letterSpacing: 3, color: "#fff", marginBottom: 4 }}>BUILD SPRINT</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#FF3B30", marginBottom: 8 }}>{getNextFridayAndSunday()}</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", marginBottom: 12 }}>Thesidejob HQ, Vadodara</div>
                        <button style={{
                            fontFamily: "var(--font-mono)", fontSize: 11, border: "1px solid #FF3B30", color: "#FF3B30",
                            background: "transparent", padding: "8px 16px", cursor: "pointer"
                        }}>RSVP</button>
                    </div>

                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 3, color: "#333", textTransform: "uppercase", marginBottom: 12 }}>CHANNELS</div>

                    {SECTIONS.map((sec) => (
                        <div key={sec.id} onClick={() => handleChannelClick(sec.id)}
                            style={{
                                padding: "10px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                                background: activeChannel === sec.id && !activeRoomId ? "#111" : "transparent",
                                borderRadius: 6, margin: "2px 0",
                                borderLeft: activeChannel === sec.id && !activeRoomId ? "2px solid #FF3B30" : "2px solid transparent",
                                color: activeChannel === sec.id && !activeRoomId ? "#fff" : "#555",
                                fontFamily: "var(--font-mono)", fontSize: 13, transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => { if (!(activeChannel === sec.id && !activeRoomId)) { e.currentTarget.style.background = "#0d0d0d"; e.currentTarget.style.color = "#888"; } }}
                            onMouseLeave={(e) => { if (!(activeChannel === sec.id && !activeRoomId)) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#555"; } }}
                        >
                            <span style={{ fontSize: 14 }}>{sec.icon}</span>
                            {sec.label}
                        </div>
                    ))}

                    {/* PRIVATE ROOMS */}
                    <div style={{
                        fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 3,
                        color: "#333", textTransform: "uppercase", marginTop: 24, marginBottom: 12
                    }}>
                        PRIVATE ROOMS
                    </div>

                    {privateRooms.map((room) => (
                        <div key={room.id} onClick={() => handleRoomClick(room)}
                            style={{
                                padding: "10px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                                background: activeRoomId === room.id ? "#111" : "transparent",
                                borderRadius: 6, margin: "2px 0",
                                borderLeft: activeRoomId === room.id ? "2px solid #FF3B30" : "2px solid transparent",
                                color: activeRoomId === room.id ? "#fff" : "#555",
                                fontFamily: "var(--font-mono)", fontSize: 13, transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => { if (activeRoomId !== room.id) { e.currentTarget.style.background = "#0d0d0d"; e.currentTarget.style.color = "#888"; } }}
                            onMouseLeave={(e) => { if (activeRoomId !== room.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#555"; } }}
                        >
                            <span style={{ fontSize: 14 }}>🔒</span>
                            {room.name}
                        </div>
                    ))}

                    <button
                        onClick={() => setShowCreateRoom(!showCreateRoom)}
                        style={{
                            fontFamily: "var(--font-mono)", fontSize: 11, color: "#FF3B30", border: "1px solid #1a1a1a",
                            padding: "8px 16px", background: "transparent", cursor: "pointer", borderRadius: 6,
                            marginTop: 8, width: "100%", transition: "border-color 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = "#FF3B30"}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1a1a1a"}
                    >
                        + Create Room
                    </button>

                    {showCreateRoom && (
                        <div style={{ marginTop: 8, padding: 12, background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 6 }}>
                            <input
                                value={newRoomName} onChange={e => setNewRoomName(e.target.value)}
                                placeholder="my-secret-room"
                                style={{
                                    width: "100%", padding: "8px", background: "#111", border: "1px solid #222",
                                    color: "#fff", fontFamily: "var(--font-mono)", fontSize: 11, marginBottom: 8,
                                    outline: "none", boxSizing: "border-box"
                                }}
                            />
                            <input
                                value={newRoomPasscode} onChange={e => setNewRoomPasscode(e.target.value)}
                                placeholder="choose a code" type="password"
                                style={{
                                    width: "100%", padding: "8px", background: "#111", border: "1px solid #222",
                                    color: "#fff", fontFamily: "var(--font-mono)", fontSize: 11, marginBottom: 8,
                                    outline: "none", boxSizing: "border-box"
                                }}
                            />
                            <button
                                onClick={handleCreateRoom}
                                disabled={!newRoomName.trim() || !newRoomPasscode.trim()}
                                style={{
                                    width: "100%", padding: "8px", background: "#FF3B30", border: "none",
                                    color: "#000", fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: 11,
                                    cursor: "pointer", borderRadius: 4, opacity: (!newRoomName.trim() || !newRoomPasscode.trim()) ? 0.5 : 1
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    )}

                    {isAdmin(user?.email) && (
                        <div style={{ marginTop: 24, borderTop: "1px solid #111", paddingTop: 16 }}>
                            <Link href="/admin/ideas" style={{
                                fontFamily: "var(--font-mono)", fontSize: 11, color: "#333", textDecoration: "none",
                                display: "block", textAlign: "center", padding: "8px"
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.color = "#FF3B30"}
                                onMouseLeave={(e) => e.currentTarget.style.color = "#333"}
                            >⚙ Admin Board</Link>
                        </div>
                    )}
                </div>

                {/* Bottom user */}
                <div style={{ padding: "16px 20px", borderTop: "1px solid #111", display: "flex", alignItems: "center", gap: 12 }}>
                    {user && profile?.username ? (
                        <>
                            <div style={{
                                width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #FF3B30, #7a0000)",
                                display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: 10, color: "#fff", flexShrink: 0,
                            }}>{getInitials(profile.username)}</div>
                            <div style={{ flex: 1, overflow: "hidden" }}>
                                <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 13, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile.username}</div>
                            </div>
                            <div onClick={handleLogout} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", cursor: "pointer" }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B30")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                            >Log out</div>
                        </>
                    ) : null}
                </div>
            </div>

            {/* ─── Main Content ─── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh" }}>
                <div style={{
                    height: 64, background: "#050505", borderBottom: "1px solid #111",
                    padding: "0 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
                }}>
                    <button className="mobile-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} style={{
                        background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 8, display: "none", alignItems: "center", justifyContent: "center",
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>

                    <span style={{ fontSize: 18 }}>{activeIcon}</span>
                    <span style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 16, color: "#fff" }}>
                        {activeName}
                    </span>
                    <div className="header-divider" style={{ width: 1, height: 20, background: "#222", marginLeft: 8 }} />
                    <span className="channel-desc" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#444" }}>
                        {activeDesc}
                    </span>

                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
                        <div className="online-indicator" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: onlineUsers.length > 0 ? "#32D74B" : "#333" }} />
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#555" }}>{onlineUsers.length}</span>
                        </div>
                        <Link href="/" className="back-to-home" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", textDecoration: "none", letterSpacing: 1, marginLeft: 8 }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B30")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                        ><span className="back-text">← TSJ</span></Link>
                    </div>
                </div>

                {/* ─── CHAT VIEW ─── */}
                <div style={{ flex: 1, overflowY: "auto", padding: "0 32px 32px" }} className="chat-messages">
                    {messages.length === 0 ? (
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#555", textAlign: "center", padding: "40px" }}>
                            No messages here yet. Be the first to say hi!
                        </div>
                    ) : messages.map((msg, i) => {
                        const isNewSender = i === 0 || messages[i - 1].sender !== msg.sender;
                        return (
                            <div key={msg.id} style={{
                                display: "flex", gap: 16, padding: isNewSender ? "16px 0 4px" : "4px 0", paddingLeft: isNewSender ? 0 : 52,
                            }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                                {isNewSender && (
                                    <div style={{
                                        width: 36, height: 36, borderRadius: "50%",
                                        background: msg.sender === displayName
                                            ? "linear-gradient(135deg, #FF3B30, #7a0000)"
                                            : `linear-gradient(135deg, #${Math.abs(msg.sender.charCodeAt(0) * 123456).toString(16).slice(0, 6)}, #333)`,
                                        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: 10, color: "#fff", flexShrink: 0,
                                    }}>{msg.avatar}</div>
                                )}
                                <div style={{ flex: 1 }}>
                                    {isNewSender && (
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                                            <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 14, color: "#fff" }}>{msg.sender}</span>
                                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#333" }}>{msg.time}</span>
                                        </div>
                                    )}
                                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#ccc", lineHeight: 1.7 }}>
                                        {formatText(msg.text, onlineUsers)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={chatEndRef} />
                </div>

                <div style={{ height: 80, background: "#050505", borderTop: "1px solid #111", padding: "0 32px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                    <div style={{ position: "relative", flex: 1 }}>
                        <input ref={inputRef} type="text" value={input}
                            onChange={handleInputChange} onKeyDown={handleKeyDown}
                            placeholder={`Message ${activeName} — type @ to mention`}
                            style={{
                                width: "100%", background: "#111", border: "1px solid #1a1a1a", color: "#fff", fontFamily: "var(--font-mono)", fontSize: 13, padding: "14px 20px", outline: "none", boxSizing: "border-box",
                            }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,59,48,0.4)")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "#1a1a1a")}
                        />
                        {showMentions && filteredMentionUsers.length > 0 && (
                            <div style={{ position: "absolute", bottom: "100%", left: 0, right: 0, background: "#0d0d0d", border: "1px solid #1e1e1e", borderBottom: "none", maxHeight: 200, overflowY: "auto", zIndex: 50 }}>
                                {filteredMentionUsers.map(u => (
                                    <div key={u} onClick={() => insertMention(u)} style={{ padding: "10px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, transition: "background 0.1s ease" }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "#111")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                    >
                                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, #${Math.abs(u.charCodeAt(0) * 123456).toString(16).slice(0, 6)}, #333)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: 8, color: "#fff" }}>{getInitials(u)}</div>
                                        <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 13, color: "#fff" }}>{u}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={{ position: "relative" }}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: emojiPickerOpen ? "#FF3B30" : "#333", cursor: "pointer" }}
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
                            <div style={{ position: "absolute", bottom: 36, right: 0, background: "#0d0d0d", border: "1px solid #1e1e1e", padding: 12, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, zIndex: 50, width: 200 }}>
                                {QUICK_EMOJIS.map((emoji) => (
                                    <button key={emoji} onClick={() => { setInput(prev => prev + emoji); setEmojiPickerOpen(false); inputRef.current?.focus(); }} style={{ background: "transparent", border: "1px solid transparent", fontSize: 20, cursor: "pointer", padding: "6px", borderRadius: 4 }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = "#111"; e.currentTarget.style.borderColor = "#333"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
                                    >{emoji}</button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={sendMessage} style={{ width: 36, height: 36, background: input.trim() ? "#FF3B30" : "#111", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() ? "pointer" : "default" }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M14 2L7 9" stroke={input.trim() ? "#000" : "#333"} strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M14 2L9.5 14.5L7 9L1.5 6.5L14 2Z" stroke={input.trim() ? "#000" : "#333"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ─── Right Sidebar ─── */}
            <div style={{ width: 220, background: "#050505", borderLeft: "1px solid #111", padding: "24px 16px", overflowY: "auto", flexShrink: 0 }} className="right-sidebar">
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 3, color: "#333", textTransform: "uppercase", marginBottom: 16 }}>ONLINE — {onlineUsers.length}</div>
                {onlineUsers.length > 0 ? onlineUsers.map(u => (
                    <div key={u} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
                        <div style={{ position: "relative" }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: u === displayName ? "linear-gradient(135deg, #FF3B30, #7a0000)" : `linear-gradient(135deg, #${Math.abs(u.charCodeAt(0) * 123456).toString(16).slice(0, 6)}, #333)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: 9, color: "#fff" }}>{getInitials(u)}</div>
                            <div style={{ position: "absolute", bottom: 0, right: 0, width: 8, height: 8, borderRadius: "50%", background: "#32D74B", border: "2px solid #050505" }} />
                        </div>
                        <div>
                            <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 12, color: "#fff" }}>
                                {u} {u === displayName && <span style={{ color: "#444", fontSize: 10 }}>(you)</span>}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#333", padding: "8px 0" }}>No one online</div>
                )}
            </div>

            <style jsx>{`
                .chat-messages::-webkit-scrollbar { width: 4px; }
                .chat-messages::-webkit-scrollbar-track { background: #111; }
                .chat-messages::-webkit-scrollbar-thumb { background: #222; }
                .chat-messages::-webkit-scrollbar-thumb:hover { background: #FF3B30; }
                @media (max-width: 900px) {
                    .right-sidebar { display: none; }
                    .back-text { display: none; }
                }
                @media (max-width: 768px) {
                    .left-sidebar { position: absolute !important; left: -280px; top: 0; bottom: 0; transition: transform 0.3s ease !important; }
                    .left-sidebar.open { transform: translateX(280px); }
                    .mobile-sidebar-toggle { display: flex !important; }
                    .channel-desc { display: none; }
                    .header-divider { display: none; }
                }
            `}</style>
        </div>
    );
}
