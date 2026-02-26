"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { DndContext, DragEndEvent, useDroppable, useDraggable, closestCenter } from '@dnd-kit/core'

// Droppable column wrapper
function DroppableColumn({ id, children, ...props }: any) {
    const { setNodeRef, isOver } = useDroppable({ id })
    return (
        <div ref={setNodeRef} style={{
            minHeight: 200,
            border: isOver ? '1px solid #FF3B30' : '1px solid #1a1a1a',
            transition: 'border-color 0.2s',
            ...props.style
        }}>
            {children}
        </div>
    )
}

// Draggable card wrapper  
function DraggableCard({ id, children }: any) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })
    return (
        <div ref={setNodeRef} {...listeners} {...attributes} style={{
            transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
            opacity: isDragging ? 0.5 : 1,
            cursor: 'grab',
            zIndex: isDragging ? 999 : 1,
            position: 'relative'
        }}>
            {children}
        </div>
    )
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const COLUMNS = [
    { id: "ideas", title: "IDEAS", color: "#555" },
    { id: "ongoing", title: "ONGOING", color: "#FF9500" },
    { id: "approved", title: "APPROVED", color: "#32D74B" },
    { id: "completed", title: "COMPLETED", color: "#0A84FF" },
    { id: "rejected", title: "REJECTED", color: "#FF3B30" },
];

interface Idea {
    id: string;
    title: string;
    description: string;
    name: string;
    email: string;
    phone: string;
    submitted_by: string;
    status: string;
    created_at: string;
}

function IdeaCard({ idea, isDragging, onApprove, onMessage, onEmail }: { idea: Idea, isDragging?: boolean, onApprove: (i: Idea) => void, onMessage: (i: Idea) => void, onEmail: (i: Idea) => void }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <div style={{
            background: "#0a0a0a", border: "1px solid #1a1a1a", padding: 20,
            borderRadius: 0, opacity: isDragging ? 0.5 : 1, cursor: "grab", marginBottom: 12
        }}>
            <h3 style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: 16, color: "#fff", margin: "0 0 8px" }}>
                {idea.title}
            </h3>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#555", marginBottom: 12 }}>
                <div>by {idea.name} {idea.phone ? `| ${idea.phone}` : ""}</div>
                <div onClick={(e) => { e.stopPropagation(); onEmail(idea); }} style={{ color: "#FF3B30", cursor: "pointer", marginTop: 4 }}>{idea.email}</div>
                <div style={{ marginTop: 4 }}>{new Date(idea.created_at).toLocaleDateString()}</div>
            </div>

            <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#ccc", lineHeight: 1.6, marginBottom: 16 }}>
                {!expanded && idea.description.length > 100
                    ? idea.description.slice(0, 100) + "..."
                    : idea.description}
                {idea.description.length > 100 && (
                    <span onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }} style={{ color: "#FF3B30", cursor: "pointer", marginLeft: 8 }}>
                        {expanded ? "read less" : "read more"}
                    </span>
                )}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <button onClick={(e) => { e.stopPropagation(); onMessage(idea); }} style={{
                    flex: 1, padding: "8px", background: "#111", border: "1px solid #222",
                    color: "#fff", fontFamily: "var(--font-mono)", fontSize: 10, cursor: "pointer",
                }}>Message on Charcha</button>
                <button onClick={(e) => { e.stopPropagation(); onEmail(idea); }} style={{
                    flex: 1, padding: "8px", background: "#111", border: "1px solid #222",
                    color: "#fff", fontFamily: "var(--font-mono)", fontSize: 10, cursor: "pointer",
                }}>Email</button>
                <button onClick={(e) => { e.stopPropagation(); onApprove(idea); }} style={{
                    width: "100%", padding: "8px", background: "#32D74B", border: "none",
                    color: "#000", fontFamily: "var(--font-mono)", fontSize: 10, cursor: "pointer", fontWeight: "bold"
                }}>Approve & Invite</button>
            </div>
        </div>
    );
}



export default function AdminIdeaBoard() {
    const router = useRouter();
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdminAndFetch = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const adminEmails = [
                'pateldev2317@gmail.com',
                'girishguptaaditya@gmail.com',
                'pateldhairya64@gmail.com',
                'vaka2182003@gmail.com'
            ];

            if (!session?.user || !adminEmails.includes(session.user.email || "")) {
                router.push("/community");
                return;
            }

            const { data } = await supabase.from("ideas").select("*").order("created_at", { ascending: false });
            if (data) setIdeas(data);
            setLoading(false);
        };
        checkAdminAndFetch();
    }, [router]);

    const updateIdeaStatus = async (id: string, status: string) => {
        setIdeas(prev => prev.map(i => i.id === id ? { ...i, status } : i));
        await supabase.from("ideas").update({ status }).eq("id", id);
    };

    const handleApproveAndInvite = async (idea: Idea) => {
        if (!confirm(`Are you sure you want to approve ${idea.title} and send an invite to ${idea.email}?`)) return;

        await updateIdeaStatus(idea.id, "approved");

        try {
            await fetch("/api/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: idea.name, email: idea.email, ideaTitle: idea.title })
            });
            alert("Invite sent successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to send invite email.");
        }
    };

    const handleMessageChannel = (idea: Idea) => {
        localStorage.setItem("charcha_mention_draft", `Hi @${idea.submitted_by} - regarding your idea "${idea.title}"...`);
        router.push("/community");
    };

    const handleEmail = (idea: Idea) => {
        window.location.href = `mailto:${idea.email}?subject=Regarding your idea: ${idea.title}`;
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const ideaId = active.id as string;
        const newStatus = over.id as string;

        // Update in Supabase
        const { error } = await supabase
            .from('ideas')
            .update({ status: newStatus })
            .eq('id', ideaId);

        if (!error) {
            setIdeas(prev => prev.map(idea =>
                idea.id === ideaId ? { ...idea, status: newStatus } : idea
            ));
        }
    };

    const pendingCount = ideas.filter(i => i.status === "ideas").length;
    const approvedCount = ideas.filter(i => i.status === "approved").length;

    if (loading) return <div style={{ background: "#000", height: "100vh", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Board...</div>;

    return (
        <div style={{ background: "#000", minHeight: "100vh", color: "#fff", padding: "80px 0 40px 0" }}>
            <div className="admin-header" style={{ padding: "0 40px", marginBottom: 32 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "#FF3B30", marginBottom: 8 }}>// Idea Board</div>
                <h1 style={{ fontFamily: "var(--font-syne)", fontWeight: 900, fontSize: 48, margin: 0 }}>Submitted Ideas</h1>

                <div className="admin-stats-card" style={{ display: "flex", gap: 32, marginTop: 24, borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a", padding: "16px 0" }}>
                    <div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", letterSpacing: 2 }}>TOTAL IDEAS</div>
                        <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 24 }}>{ideas.length}</div>
                    </div>
                    <div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", letterSpacing: 2 }}>PENDING</div>
                        <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 24, color: "#FF9500" }}>{pendingCount}</div>
                    </div>
                    <div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#555", letterSpacing: 2 }}>APPROVED</div>
                        <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 24, color: "#32D74B" }}>{approvedCount}</div>
                    </div>
                </div>
            </div>

            <div className="admin-board" style={{ padding: "0 40px", overflowX: "auto" }}>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <div style={{ display: "flex", gap: 24, minWidth: "max-content" }}>
                        {COLUMNS.map(col => {
                            const columnIdeas = ideas.filter(i => i.status === col.id);
                            return (
                                <DroppableColumn key={col.id} id={col.id} style={{ width: 340, background: "#050505", display: "flex", flexDirection: "column" }}>
                                    <div style={{
                                        padding: "16px", borderBottom: `2px solid ${col.color}`,
                                        display: "flex", justifyContent: "space-between", alignItems: "center",
                                        background: "#050505"
                                    }}>
                                        <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 14, letterSpacing: 2 }}>{col.title}</div>
                                        <div style={{
                                            background: "#111", padding: "2px 8px", borderRadius: 12,
                                            fontFamily: "var(--font-mono)", fontSize: 10, color: col.color
                                        }}>{columnIdeas.length}</div>
                                    </div>
                                    <div style={{ padding: "16px", flex: 1, minHeight: 400 }}>
                                        {columnIdeas.map(idea => (
                                            <DraggableCard key={idea.id} id={idea.id}>
                                                <IdeaCard
                                                    idea={idea}
                                                    onApprove={handleApproveAndInvite}
                                                    onMessage={handleMessageChannel}
                                                    onEmail={handleEmail}
                                                />
                                            </DraggableCard>
                                        ))}
                                    </div>
                                </DroppableColumn>
                            );
                        })}
                    </div>
                </DndContext>
            </div>
            <style jsx>{`
                @media (max-width: 768px) {
                    .admin-header, .admin-board { padding: 0 16px !important; }
                    .admin-stats-card { flex-wrap: wrap; gap: 16px !important; }
                }
            `}</style>
        </div>
    );
}
