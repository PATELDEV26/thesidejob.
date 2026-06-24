import Footer from "@/components/layout/Footer";
import Link from "next/link";
import React from "react";

export const metadata = {
    title: "NovaSift - Organize Your Desktop in 1 Click",
    description: "Deep local AI instantly categorizes your files. No cloud uploads. Pure privacy.",
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
                        background: "rgba(255, 59, 48, 0.1)",
                        color: "#FF3B30",
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
                        Organize Your Desktop Chaos in <span style={{ color: "#FF3B30" }}>1 Click.</span>
                    </h1>
                    <p style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(16px, 2vw, 20px)",
                        color: "#888",
                        maxWidth: "600px",
                        margin: "0 auto 40px auto",
                        lineHeight: 1.6
                    }}>
                        Deep local AI instantly categorizes your files. No cloud uploads. No monthly fees. Pure privacy.
                    </p>
                    <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="https://github.com/thesidejob/novasift/releases/latest" target="_blank" rel="noopener noreferrer" 
                            className="transition-all duration-300 ease-in-out hover:bg-[#FF3B30] hover:text-white"
                            style={{
                            background: "#fff",
                            color: "#000",
                            padding: "16px 32px",
                            borderRadius: "100px",
                            fontFamily: "var(--font-syne)",
                            fontWeight: 700,
                            textDecoration: "none",
                        }}
                        >
                            Download for macOS
                        </a>
                        <a href="#pricing" 
                            className="transition-all duration-300 ease-in-out hover:border-[#FF3B30]"
                            style={{
                            background: "transparent",
                            color: "#fff",
                            border: "1px solid rgba(255,255,255,0.2)",
                            padding: "16px 32px",
                            borderRadius: "100px",
                            fontFamily: "var(--font-syne)",
                            fontWeight: 700,
                            textDecoration: "none",
                        }}
                        >
                            View Pricing
                        </a>
                    </div>
                </section>

                {/* Problem / Solution Section */}
                <section style={{ marginBottom: "100px" }}>
                    <div style={{ background: "#111", borderRadius: "24px", padding: "clamp(32px, 5vw, 64px)" }}>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "32px", marginBottom: "16px" }}>The Problem</h2>
                        <p style={{ fontFamily: "var(--font-mono)", color: "#888", marginBottom: "40px", fontSize: "16px", lineHeight: 1.6 }}>
                            You’re drowning in 'Screenshot 2024...', scattered PDFs, and a messy Downloads folder. Finding that one invoice or design asset takes way too long.
                        </p>
                        
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "32px", marginBottom: "16px", color: "#FF3B30" }}>The Solution</h2>
                        <p style={{ fontFamily: "var(--font-mono)", color: "#888", marginBottom: "40px", fontSize: "16px", lineHeight: 1.6 }}>
                            NovaSift uses local AI models to understand <i>what</i> your files are and automatically moves them to smart folders.
                        </p>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
                            {[
                                { title: "Privacy First", desc: "Files never leave your machine. Processing happens locally." },
                                { title: "Smart Categories", desc: "AI understands context, not just file extensions." },
                                { title: "Custom Rules", desc: "Define your own organization logic with natural language." },
                                { title: "Lightning Fast", desc: "Powered by highly optimized local models." }
                            ].map((feature, i) => (
                                <div key={i} style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", background: "rgba(0,0,0,0.2)" }}>
                                    <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "20px", marginBottom: "8px" }}>{feature.title}</h3>
                                    <p style={{ fontFamily: "var(--font-mono)", color: "#888", fontSize: "14px", lineHeight: 1.5 }}>{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section style={{ marginBottom: "100px", textAlign: "center" }}>
                    <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "48px", marginBottom: "48px" }}>How It Works</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px" }}>
                        {[
                            { step: "1", title: "Download & Install", desc: "Grab the macOS app from our releases." },
                            { step: "2", title: "Connect AI", desc: "Add your API key (Gemini, OpenAI, or local model)." },
                            { step: "3", title: "Click 'Organize'", desc: "Watch your folders clean themselves up instantly." }
                        ].map((item, i) => (
                            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(255, 59, 48, 0.1)", color: "#FF3B30", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontFamily: "var(--font-syne)", fontWeight: "bold", marginBottom: "24px" }}>
                                    {item.step}
                                </div>
                                <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", marginBottom: "12px" }}>{item.title}</h3>
                                <p style={{ fontFamily: "var(--font-mono)", color: "#888", fontSize: "14px", lineHeight: 1.5 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pricing */}
                <section id="pricing" style={{ marginBottom: "100px" }}>
                    <div style={{ textAlign: "center", marginBottom: "48px" }}>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "48px", marginBottom: "16px" }}>Pricing</h2>
                        <p style={{ fontFamily: "var(--font-mono)", color: "#888" }}>The core app is <strong style={{color:"#fff"}}>free forever</strong>. Pro unlocks advanced features.</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", alignItems: "stretch" }}>
                        {/* Free Tier */}
                        <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "40px", display: "flex", flexDirection: "column" }}>
                            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", marginBottom: "8px" }}>Free</h3>
                            <div style={{ fontFamily: "var(--font-syne)", fontSize: "48px", fontWeight: "bold", marginBottom: "24px" }}>$0</div>
                            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", fontFamily: "var(--font-mono)", color: "#888", fontSize: "14px", flexGrow: 1 }}>
                                <li style={{ marginBottom: "12px" }}>✓ Basic categorization</li>
                                <li style={{ marginBottom: "12px" }}>✓ Manual trigger</li>
                                <li style={{ marginBottom: "12px" }}>✓ Local processing</li>
                            </ul>
                            <a href="https://github.com/thesidejob/novasift/releases/latest" target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", padding: "16px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "100px", fontFamily: "var(--font-syne)", fontWeight: "bold", color: "#fff", textDecoration: "none" }}>Download</a>
                        </div>
                        {/* Pro Monthly */}
                        <div style={{ border: "1px solid #FF3B30", borderRadius: "24px", padding: "40px", display: "flex", flexDirection: "column", position: "relative", background: "rgba(255, 59, 48, 0.02)" }}>
                            <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#FF3B30", color: "#fff", padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontFamily: "var(--font-mono)", fontWeight: "bold" }}>MOST POPULAR</div>
                            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", marginBottom: "8px" }}>Pro (Monthly)</h3>
                            <div style={{ fontFamily: "var(--font-syne)", fontSize: "48px", fontWeight: "bold", marginBottom: "24px" }}>$4.99<span style={{ fontSize: "16px", color: "#888" }}>/mo</span></div>
                            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", fontFamily: "var(--font-mono)", color: "#888", fontSize: "14px", flexGrow: 1 }}>
                                <li style={{ marginBottom: "12px" }}>✓ Everything in Free</li>
                                <li style={{ marginBottom: "12px", color: "#fff" }}>✓ Auto-scheduling</li>
                                <li style={{ marginBottom: "12px", color: "#fff" }}>✓ Custom natural language rules</li>
                                <li style={{ marginBottom: "12px" }}>✓ Priority support</li>
                            </ul>
                            <div style={{ textAlign: "center", padding: "16px", background: "#FF3B30", borderRadius: "100px", fontFamily: "var(--font-syne)", fontWeight: "bold", color: "#fff", cursor: "default" }}>Buy in App</div>
                        </div>
                        {/* Pro Lifetime */}
                        <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "40px", display: "flex", flexDirection: "column" }}>
                            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", marginBottom: "8px" }}>Pro (Lifetime)</h3>
                            <div style={{ fontFamily: "var(--font-syne)", fontSize: "48px", fontWeight: "bold", marginBottom: "24px" }}>$29.99<span style={{ fontSize: "16px", color: "#888" }}>/once</span></div>
                            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", fontFamily: "var(--font-mono)", color: "#888", fontSize: "14px", flexGrow: 1 }}>
                                <li style={{ marginBottom: "12px" }}>✓ Everything in Pro</li>
                                <li style={{ marginBottom: "12px", color: "#fff" }}>✓ Lifetime updates</li>
                                <li style={{ marginBottom: "12px" }}>✓ One-time payment</li>
                            </ul>
                            <div style={{ textAlign: "center", padding: "16px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "100px", fontFamily: "var(--font-syne)", fontWeight: "bold", color: "#fff", cursor: "default" }}>Buy in App</div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section>
                    <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "48px", marginBottom: "48px", textAlign: "center" }}>FAQ</h2>
                    <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "24px" }}>
                            <h4 style={{ fontFamily: "var(--font-syne)", fontSize: "20px", marginBottom: "12px" }}>Is my data sent to the cloud?</h4>
                            <p style={{ fontFamily: "var(--font-mono)", color: "#888", fontSize: "14px", lineHeight: 1.6 }}>No, it's processed locally on your machine to protect your privacy, unless you specifically choose to provide and use a cloud API key (like OpenAI or Gemini).</p>
                        </div>
                        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "24px" }}>
                            <h4 style={{ fontFamily: "var(--font-syne)", fontSize: "20px", marginBottom: "12px" }}>Do you support Windows?</h4>
                            <p style={{ fontFamily: "var(--font-mono)", color: "#888", fontSize: "14px", lineHeight: 1.6 }}>Currently NovaSift is available for macOS only. Windows support is on our roadmap.</p>
                        </div>
                        <div>
                            <h4 style={{ fontFamily: "var(--font-syne)", fontSize: "20px", marginBottom: "12px" }}>How do licenses work?</h4>
                            <p style={{ fontFamily: "var(--font-mono)", color: "#888", fontSize: "14px", lineHeight: 1.6 }}>Licenses are managed securely via our dashboard and are tied to your email address. You can activate or deactivate devices at any time.</p>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
