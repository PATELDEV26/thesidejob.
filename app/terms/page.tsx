import Footer from "@/components/layout/Footer";
import React from "react";

export const metadata = {
    title: "Terms of Service | NovaSift",
    description: "Terms of Service for NovaSift software.",
};

export default function TermsPage() {
    return (
        <div className="page-wrapper" style={{ overflowX: "hidden", background: "#050505", minHeight: "100vh", color: "#fff" }}>
            <main style={{ paddingTop: "120px", paddingBottom: "80px", maxWidth: "800px", margin: "0 auto", padding: "120px 24px 80px 24px" }}>
                <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, marginBottom: "48px", textAlign: "center" }}>
                    Terms of Service
                </h1>
                
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "16px", color: "#ccc", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: "32px" }}>
                    <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", color: "#fff", marginBottom: "16px" }}>1. Acceptance of Terms</h2>
                        <p>By downloading, installing, or using NovaSift, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the software.</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", color: "#fff", marginBottom: "16px" }}>2. Software Licensing</h2>
                        <p>We offer both a Free Tier and a Pro Tier (available as a monthly subscription or lifetime license). The software is licensed, not sold. You are granted a limited, non-exclusive, non-transferable license to use NovaSift strictly in accordance with these Terms. You may not distribute, reverse engineer, decompile, or create derivative works of the software.</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", color: "#fff", marginBottom: "16px" }}>3. Acceptable Use</h2>
                        <p>You agree to use the software only for lawful purposes. You must not use the software to process, organize, or distribute malicious code, illegal content, or materials that violate the rights of others.</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", color: "#fff", marginBottom: "16px" }}>4. BYOK Responsibilities (Bring Your Own Key)</h2>
                        <p>If you connect third-party APIs (e.g., OpenAI, Gemini) using your own API key, you are solely responsible for compliance with those third parties' terms of service and any costs incurred through their usage. NovaSift is not liable for API charges or rate limits imposed by your chosen provider.</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", color: "#fff", marginBottom: "16px" }}>5. Termination</h2>
                        <p>We reserve the right to terminate or suspend your license and access to the Pro features at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", color: "#fff", marginBottom: "16px" }}>6. Limitation of Liability</h2>
                        <p>NovaSift is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the software, including any data loss due to automated file organization.</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", color: "#fff", marginBottom: "16px" }}>7. Contact</h2>
                        <p>If you have questions regarding these Terms, please contact support@thesidejob.co.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
