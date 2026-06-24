import Footer from "@/components/layout/Footer";
import React from "react";

export const metadata = {
    title: "NovaSift — AI-Powered Gmail Desktop Client | The Side Job",
    description: "NovaSift is an AI-powered desktop email client that runs locally on your machine. Your emails never leave your computer.",
};

export default function NovaSiftPage() {
    return (
        <div className="page-wrapper" style={{ overflowX: "hidden", background: "#050505", minHeight: "100vh", color: "#fff" }}>
            <main style={{ paddingTop: "120px", paddingBottom: "80px", maxWidth: "1200px", margin: "0 auto", padding: "120px 24px 80px 24px" }}>
                
                {/* Hero Section */}
                <section style={{ textAlign: "center", marginBottom: "100px" }}>
                    <div style={{
                        display: "inline-block",
                        padding: "8px 16px",
                        background: "rgba(99, 102, 241, 0.1)",
                        color: "#6366f1",
                        borderRadius: "100px",
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                        fontWeight: "bold",
                        marginBottom: "24px"
                    }}>
                        100% Local Processing • BYOK (Bring Your Own Key)
                    </div>
                    <h1 style={{
                        fontFamily: "var(--font-syne)",
                        fontSize: "clamp(40px, 8vw, 80px)",
                        fontWeight: 900,
                        lineHeight: 1.1,
                        marginBottom: "24px",
                        letterSpacing: "-0.04em"
                    }}>
                        Your Gmail, Finally <span style={{ color: "#6366f1" }}>Under Control.</span>
                    </h1>
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(16px, 2vw, 20px)",
                        color: "#888",
                        maxWidth: "600px",
                        margin: "0 auto 40px auto",
                        lineHeight: 1.6
                    }}>
                        NovaSift is an AI-powered desktop email client that runs locally on your machine. Your emails never leave your computer.
                    </p>
                    <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "24px" }}>
                        <a href="#download" 
                            className="transition-all duration-300 ease-in-out hover:bg-[#6366f1] hover:text-white hover:border-[#6366f1]"
                            style={{
                            background: "#fff",
                            color: "#000",
                            border: "1px solid #fff",
                            padding: "16px 32px",
                            borderRadius: "100px",
                            fontFamily: "var(--font-syne)",
                            fontWeight: 700,
                            textDecoration: "none",
                        }}
                        >
                            Download for Windows
                        </a>
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "#666" }}>
                        Free forever · Pro from ₹249/month · Your data stays on your device
                    </div>
                </section>

                {/* Problem / Solution Section */}
                <section style={{ marginBottom: "100px" }}>
                    <div style={{ background: "#111", borderRadius: "24px", padding: "clamp(32px, 5vw, 64px)" }}>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "32px", marginBottom: "40px", textAlign: "center" }}>Built different from every other email app</h2>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
                            <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", background: "rgba(0,0,0,0.2)" }}>
                                <div style={{ fontSize: "32px", marginBottom: "16px" }}>🛡️</div>
                                <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "20px", marginBottom: "8px" }}>Privacy First</h3>
                                <p style={{ fontFamily: "var(--font-mono)", color: "#888", fontSize: "14px", lineHeight: 1.5 }}>BYOK model — bring your own AI key. NovaSift never sees your emails. Everything runs locally on your machine.</p>
                            </div>
                            <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", background: "rgba(0,0,0,0.2)" }}>
                                <div style={{ fontSize: "32px", marginBottom: "16px" }}>⚡</div>
                                <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "20px", marginBottom: "8px" }}>Actually Fast</h3>
                                <p style={{ fontFamily: "var(--font-mono)", color: "#888", fontSize: "14px", lineHeight: 1.5 }}>Local SQLite database means instant search and offline access. No waiting for servers. No spinners.</p>
                            </div>
                            <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", background: "rgba(0,0,0,0.2)" }}>
                                <div style={{ fontSize: "32px", marginBottom: "16px" }}>🧠</div>
                                <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "20px", marginBottom: "8px" }}>Genuinely Intelligent</h3>
                                <p style={{ fontFamily: "var(--font-mono)", color: "#888", fontSize: "14px", lineHeight: 1.5 }}>AI classifies, prioritizes, and summarizes your inbox in the background. You only see what matters.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section style={{ marginBottom: "100px" }}>
                    <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "48px", marginBottom: "48px", textAlign: "center" }}>Everything you need. Nothing you don't.</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>
                        <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "40px" }}>
                            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", marginBottom: "8px" }}>Free Tier</h3>
                            <div style={{ fontFamily: "var(--font-mono)", color: "#888", marginBottom: "24px" }}>₹0 forever</div>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontFamily: "var(--font-mono)", color: "#ccc", fontSize: "15px", lineHeight: 2 }}>
                                <li>✓ Smart AI Classification</li>
                                <li>✓ Priority Levels</li>
                                <li>✓ Focus Mode</li>
                                <li>✓ Sender Rules Engine</li>
                                <li>✓ Local SQLite & Offline access</li>
                                <li>✓ Command Center Dashboard</li>
                            </ul>
                        </div>
                        <div style={{ border: "1px solid #6366f1", borderRadius: "24px", padding: "40px", background: "rgba(99, 102, 241, 0.05)" }}>
                            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", marginBottom: "8px" }}>Pro Tier</h3>
                            <div style={{ fontFamily: "var(--font-mono)", color: "#6366f1", marginBottom: "24px" }}>₹249/month or Lifetime</div>
                            <div style={{ fontFamily: "var(--font-mono)", color: "#888", fontSize: "14px", marginBottom: "16px" }}>Everything in Free, plus:</div>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontFamily: "var(--font-mono)", color: "#fff", fontSize: "15px", lineHeight: 2 }}>
                                <li>✓ AI Thread Summarizer & TL;DR</li>
                                <li>✓ Follow-up Reminders</li>
                                <li>✓ Smart Newsletter Manager</li>
                                <li>✓ AI Smart Auto-Drafts</li>
                                <li>✓ Auto-Archive low-priority</li>
                                <li>✓ Daily Briefing Digest</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section id="pricing" style={{ marginBottom: "100px" }}>
                    <div style={{ textAlign: "center", marginBottom: "48px" }}>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "48px", marginBottom: "16px" }}>Simple pricing</h2>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", alignItems: "stretch" }}>
                        {/* Free Tier */}
                        <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "40px", display: "flex", flexDirection: "column" }}>
                            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", marginBottom: "8px" }}>Free</h3>
                            <div style={{ fontFamily: "var(--font-syne)", fontSize: "48px", fontWeight: "bold", marginBottom: "24px" }}>₹0<span style={{ fontSize: "16px", color: "#888" }}>/forever</span></div>
                            <div style={{ flexGrow: 1 }}></div>
                            <a href="#download" style={{ display: "block", textAlign: "center", padding: "16px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "100px", fontFamily: "var(--font-syne)", fontWeight: "bold", color: "#fff", textDecoration: "none" }}>Download Free</a>
                        </div>
                        {/* Pro Monthly */}
                        <div style={{ border: "1px solid #6366f1", borderRadius: "24px", padding: "40px", display: "flex", flexDirection: "column", position: "relative", background: "rgba(99, 102, 241, 0.05)" }}>
                            <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#6366f1", color: "#fff", padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontFamily: "var(--font-mono)", fontWeight: "bold" }}>MOST POPULAR</div>
                            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", marginBottom: "8px" }}>Pro Monthly</h3>
                            <div style={{ fontFamily: "var(--font-syne)", fontSize: "48px", fontWeight: "bold", marginBottom: "24px" }}>₹249<span style={{ fontSize: "16px", color: "#888" }}>/mo</span></div>
                            <div style={{ flexGrow: 1 }}></div>
                            <a href="#download" style={{ display: "block", textAlign: "center", padding: "16px", background: "#6366f1", borderRadius: "100px", fontFamily: "var(--font-syne)", fontWeight: "bold", color: "#fff", textDecoration: "none" }}>Get Pro (In App)</a>
                        </div>
                        {/* Pro Lifetime */}
                        <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "40px", display: "flex", flexDirection: "column" }}>
                            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", marginBottom: "8px" }}>Pro Lifetime</h3>
                            <div style={{ fontFamily: "var(--font-syne)", fontSize: "48px", fontWeight: "bold", marginBottom: "8px" }}>₹2499<span style={{ fontSize: "16px", color: "#888" }}>/once</span></div>
                            <div style={{ fontFamily: "var(--font-mono)", color: "#888", fontSize: "14px", marginBottom: "24px" }}>Pay once, own forever</div>
                            <div style={{ flexGrow: 1 }}></div>
                            <a href="#download" style={{ display: "block", textAlign: "center", padding: "16px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "100px", fontFamily: "var(--font-syne)", fontWeight: "bold", color: "#fff", textDecoration: "none" }}>Get Lifetime (In App)</a>
                        </div>
                    </div>
                    <p style={{ textAlign: "center", marginTop: "24px", fontFamily: "var(--font-mono)", fontSize: "14px", color: "#666" }}>Payments secured by Razorpay. Refund policy applies.</p>
                </section>

                {/* Download Section */}
                <section id="download" style={{ marginBottom: "100px", textAlign: "center", background: "#111", borderRadius: "24px", padding: "64px 24px" }}>
                    <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "48px", marginBottom: "16px" }}>Download NovaSift</h2>
                    <p style={{ fontFamily: "var(--font-mono)", color: "#888", marginBottom: "40px" }}>Free to download. Pro features unlock inside the app.</p>
                    
                    <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "24px" }}>
                        <a href="https://github.com/PATELDEV26/novasift/releases/latest/download/NovaSift-Setup.exe" 
                            className="transition-all duration-300 ease-in-out hover:bg-[#6366f1] hover:text-white"
                            style={{
                            background: "#fff",
                            color: "#000",
                            padding: "16px 32px",
                            borderRadius: "100px",
                            fontFamily: "var(--font-syne)",
                            fontWeight: 700,
                            textDecoration: "none",
                        }}>
                            Download for Windows (.exe)
                        </a>
                    </div>
                    <p style={{ fontFamily: "var(--font-mono)", color: "#666", fontSize: "14px", marginBottom: "32px" }}>Version 1.0.0 · Windows 10+ supported</p>
                    
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "32px", maxWidth: "400px", margin: "0 auto" }}>
                        <p style={{ fontFamily: "var(--font-mono)", color: "#aaa", fontSize: "14px", lineHeight: 1.6 }}>
                            <strong>Already purchased Pro?</strong><br/>
                            Download the app and activate your license key from Settings → License inside the app.
                        </p>
                    </div>
                </section>

                {/* FAQ */}
                <section>
                    <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "48px", marginBottom: "48px", textAlign: "center" }}>Common questions</h2>
                    <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "24px" }}>
                            <h4 style={{ fontFamily: "var(--font-syne)", fontSize: "20px", marginBottom: "12px" }}>Is my email data safe?</h4>
                            <p style={{ fontFamily: "var(--font-mono)", color: "#888", fontSize: "14px", lineHeight: 1.6 }}>Yes. NovaSift runs entirely on your machine. Your emails are fetched via IMAP directly to a local database. The only data that leaves your machine is what you send to your chosen AI provider using your own API key — we never see it.</p>
                        </div>
                        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "24px" }}>
                            <h4 style={{ fontFamily: "var(--font-syne)", fontSize: "20px", marginBottom: "12px" }}>What AI providers are supported?</h4>
                            <p style={{ fontFamily: "var(--font-mono)", color: "#888", fontSize: "14px", lineHeight: 1.6 }}>OpenAI, Anthropic (Claude), Google Gemini, Groq, and NVIDIA NIM. You bring your own API key, so you're always in control of costs.</p>
                        </div>
                        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "24px" }}>
                            <h4 style={{ fontFamily: "var(--font-syne)", fontSize: "20px", marginBottom: "12px" }}>How does the Pro license work?</h4>
                            <p style={{ fontFamily: "var(--font-mono)", color: "#888", fontSize: "14px", lineHeight: 1.6 }}>After payment, you receive a license key via email. Open NovaSift, go to Settings → License, paste your key, and Pro features unlock instantly. One license works on up to 2 devices.</p>
                        </div>
                        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "24px" }}>
                            <h4 style={{ fontFamily: "var(--font-syne)", fontSize: "20px", marginBottom: "12px" }}>Can I get a refund?</h4>
                            <p style={{ fontFamily: "var(--font-mono)", color: "#888", fontSize: "14px", lineHeight: 1.6 }}>Yes. We offer a 7-day refund on monthly plans if you're not satisfied. Lifetime purchases are non-refundable after 14 days. See our refund policy for details.</p>
                        </div>
                        <div>
                            <h4 style={{ fontFamily: "var(--font-syne)", fontSize: "20px", marginBottom: "12px" }}>Does it work on Windows and Mac?</h4>
                            <p style={{ fontFamily: "var(--font-mono)", color: "#888", fontSize: "14px", lineHeight: 1.6 }}>Currently, NovaSift is compiled for Windows 10+. Mac support may be added in the future if requested.</p>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
