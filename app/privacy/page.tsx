import Footer from "@/components/layout/Footer";
import React from "react";

export const metadata = {
    title: "Privacy Policy | NovaSift",
    description: "Privacy Policy for NovaSift. Learn how we protect your data.",
};

export default function PrivacyPage() {
    return (
        <div className="page-wrapper" style={{ overflowX: "hidden", background: "#050505", minHeight: "100vh", color: "#fff" }}>
            <main style={{ paddingTop: "120px", paddingBottom: "80px", maxWidth: "800px", margin: "0 auto", padding: "120px 24px 80px 24px" }}>
                <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, marginBottom: "48px", textAlign: "center" }}>
                    Privacy Policy
                </h1>
                
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "16px", color: "#ccc", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: "32px" }}>
                    <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", color: "#fff", marginBottom: "16px" }}>1. Local-First Architecture</h2>
                        <p>NovaSift is built on a local-first philosophy. Your files and folders never leave your machine. All file processing, categorization, and analysis occurs entirely locally on your hardware, ensuring maximum privacy and security.</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", color: "#fff", marginBottom: "16px" }}>2. Bring Your Own Key (BYOK)</h2>
                        <p>If you choose to use cloud-based AI models (such as OpenAI or Gemini) instead of local models, you must provide your own API key (BYOK). Your API key is stored securely in your system's keychain/credentials manager. Your file metadata is only sent directly from your machine to the respective API provider. NovaSift does not intermediate, log, or store this data.</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", color: "#fff", marginBottom: "16px" }}>3. Data Collection</h2>
                        <p>We believe in collecting only what is strictly necessary. The only information we collect relates to:</p>
                        <ul style={{ paddingLeft: "24px", marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <li><strong>Account & Licensing:</strong> We collect your email address when you purchase a license to link your subscription and device activations.</li>
                            <li><strong>Transactions:</strong> Basic purchase history necessary for accounting and support. We do not store your credit card details.</li>
                            <li><strong>Usage Analytics:</strong> Opt-in anonymous crash reports and minimal app usage metrics to help us improve stability.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", color: "#fff", marginBottom: "16px" }}>4. Third-Party Services</h2>
                        <p>We use the following trusted third-party services for specific functional purposes:</p>
                        <ul style={{ paddingLeft: "24px", marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <li><strong>Razorpay:</strong> Used for processing payments. We do not store any sensitive financial data on our servers.</li>
                            <li><strong>Resend:</strong> Used for sending transactional emails (like license keys and receipts).</li>
                            <li><strong>Sentry:</strong> Used for capturing application errors and crash logs to help us identify and fix bugs quickly.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", color: "#fff", marginBottom: "16px" }}>5. Contact Us</h2>
                        <p>If you have any questions or concerns about this Privacy Policy, please contact us at privacy@thesidejob.co.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
