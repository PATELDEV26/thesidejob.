import Footer from "@/components/layout/Footer";
import React from "react";

export const metadata = {
    title: "Refund Policy | NovaSift",
    description: "Refund Policy for NovaSift purchases.",
};

export default function RefundPage() {
    return (
        <div className="page-wrapper" style={{ overflowX: "hidden", background: "#050505", minHeight: "100vh", color: "#fff" }}>
            <main style={{ paddingTop: "120px", paddingBottom: "80px", maxWidth: "800px", margin: "0 auto", padding: "120px 24px 80px 24px" }}>
                <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, marginBottom: "48px", textAlign: "center" }}>
                    Refund Policy
                </h1>
                
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "16px", color: "#ccc", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: "32px" }}>
                    <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", color: "#fff", marginBottom: "16px" }}>1. General Philosophy</h2>
                        <p>We want you to be fully satisfied with NovaSift. Since we offer a generous Free Tier, we highly recommend testing the core functionality of the app before upgrading to a Pro license to ensure it meets your needs and works well on your machine.</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", color: "#fff", marginBottom: "16px" }}>2. Monthly Subscriptions</h2>
                        <p>For the Pro Monthly subscription, we offer a <strong>7-day money-back guarantee</strong> on your first payment. If you are not satisfied within the first 7 days of your initial subscription, contact us for a full refund. Subsequent monthly renewals are non-refundable, but you can cancel your subscription at any time to prevent future charges.</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", color: "#fff", marginBottom: "16px" }}>3. Lifetime Licenses</h2>
                        <p>For the Pro Lifetime license, we offer a <strong>14-day money-back guarantee</strong>. If NovaSift doesn't fit your workflow within the first two weeks of your lifetime purchase, please let us know, and we will issue a full refund and deactivate the license key.</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", color: "#fff", marginBottom: "16px" }}>4. How to Request a Refund</h2>
                        <p>To request a refund, please email <strong>support@thesidejob.co</strong> from the email address used to purchase your license. Include your license key or order number in the email. We aim to process all refund requests within 3-5 business days.</p>
                    </section>

                    <section>
                        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "24px", color: "#fff", marginBottom: "16px" }}>5. Exceptions</h2>
                        <p>Refunds will not be granted for accounts that have been terminated due to a violation of our Terms of Service (e.g., distributing cracked versions, attempting to reverse engineer the software, or engaging in fraudulent activity).</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
