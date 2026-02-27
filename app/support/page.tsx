"use client";

import { useState } from "react";
import Link from "next/link";

const TIERS = [
    {
        emoji: "☕",
        title: "One Chai",
        description: "Keeps one of us awake for 2 hours. Probably Dhariya.",
        amount: 69,
        featured: false,
    },
    {
        emoji: "🍕",
        title: "Fuel a Sprint",
        description: "Feeds the whole house during a 48-hour build session.",
        amount: 469,
        featured: true,
    },
    {
        emoji: "🚀",
        title: "Back a Builder",
        description: "Covers a month of hosting, domains, and tools for one project.",
        amount: 969,
        featured: false,
    },
];

export default function SupportPage() {
    const [customAmount, setCustomAmount] = useState("");
    const [showQR, setShowQR] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [copied, setCopied] = useState(false);

    const handlePayment = (amount: number) => {
        const upiId = '7043338711@ybl'; // replace with your actual UPI ID
        const name = 'Thesidejob';
        const note = 'Supporting+Thesidejob+Hacker+House';

        // UPI deep link — opens GPay/PhonePe/Paytm directly
        const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${note}`;

        // Intent links for specific apps as fallback
        const gPayLink = `tez://upi/pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${note}`;
        const phonePeLink = `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${note}`;

        // Try opening UPI deep link
        window.location.href = upiLink;

        // After 1.5s if app didn't open, show QR modal fallback
        setTimeout(() => {
            setShowQR(true);
            setSelectedAmount(amount);
        }, 1500);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText("7043338711@ybl");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCustomSend = () => {
        const amt = parseInt(customAmount);
        if (amt && amt >= 1) {
            handlePayment(amt);
        }
    };

    const buttonStyle: React.CSSProperties = {
        background: "#FF3B30",
        color: "#000",
        fontFamily: "var(--font-syne)",
        fontWeight: 900,
        fontSize: 13,
        letterSpacing: 2,
        textTransform: "uppercase",
        padding: "12px 24px",
        border: "none",
        borderRadius: 0,
        cursor: "pointer",
        transition: "background 0.2s ease",
        flexShrink: 0,
    };

    const upiIdForQr = "7043338711@ybl";
    const qrUrl = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=upi://pay?pa=${upiIdForQr}%26pn=Thesidejob%26am=${selectedAmount}%26cu=INR`;
    const gPayLink = `tez://upi/pay?pa=${upiIdForQr}&pn=Thesidejob&am=${selectedAmount}&cu=INR&tn=Supporting+Thesidejob+Hacker+House`;
    const phonePeLink = `phonepe://pay?pa=${upiIdForQr}&pn=Thesidejob&am=${selectedAmount}&cu=INR&tn=Supporting+Thesidejob+Hacker+House`;
    const paytmLink = `paytmmp://pay?pa=${upiIdForQr}&pn=Thesidejob&am=${selectedAmount}&cu=INR&tn=Supporting+Thesidejob+Hacker+House`;

    return (
        <div style={{ background: "#000", minHeight: "100vh" }}>
            {/* Fixed top nav for Support page */}
            <nav
                className="support-nav"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    background: "rgba(0,0,0,0.9)",
                    backdropFilter: "blur(20px)",
                    borderBottom: "1px solid #111",
                    padding: "20px 48px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Link
                    href="/"
                    style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 900,
                        fontSize: 18,
                        color: "#fff",
                        textDecoration: "none",
                    }}
                >
                    Thesidejob<span style={{ color: "#FF3B30" }}>.</span>
                </Link>
                <a
                    href="/"
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "#555",
                        textDecoration: "none",
                        transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B30")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                >
                    ← Main Site
                </a>
            </nav>

            <div
                className="support-wrapper"
                style={{
                    maxWidth: 680,
                    margin: "0 auto",
                    padding: "120px 24px",
                }}
            >
                {/* Eyebrow */}
                <div
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        letterSpacing: 5,
                        textTransform: "uppercase",
                        color: "#FF3B30",
                        marginBottom: 24,
                    }}
                >
                    {`// support the mission`}
                </div>

                {/* Headline */}
                <div
                    className="support-headline"
                    style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 900,
                        fontSize: "clamp(48px, 7vw, 88px)",
                        letterSpacing: -3,
                        lineHeight: 0.9,
                        color: "#fff",
                    }}
                >
                    <div>Fuel the</div>
                    <div>
                        Hacker House<span style={{ color: "#FF3B30" }}>.</span>
                    </div>
                </div>

                {/* Subheading */}
                <p
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 14,
                        color: "#555",
                        lineHeight: 1.8,
                        marginTop: 24,
                    }}
                >
                    We run on chai, code, and chaos. If something we built, wrote,
                    or shipped helped you — or if you just believe in what
                    we&apos;re doing — you can fuel our next all-nighter.
                </p>

                {/* Divider */}
                <div
                    style={{
                        width: "100%",
                        height: 1,
                        background: "#FF3B30",
                        margin: "48px 0",
                    }}
                />

                {/* Tier Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {TIERS.map((tier) => (
                        <div
                            key={tier.title}
                            className="support-card"
                            style={{
                                background: "#0a0a0a",
                                border: "1px solid #1a1a1a",
                                borderLeft: tier.featured
                                    ? "3px solid #FF3B30"
                                    : "1px solid #1a1a1a",
                                padding: "28px 32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 24,
                                transition: "border-color 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "rgba(255,59,48,0.3)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "#1a1a1a";
                                if (tier.featured) {
                                    e.currentTarget.style.borderLeftColor = "#FF3B30";
                                }
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-syne)",
                                        fontWeight: 800,
                                        fontSize: 18,
                                        color: "#fff",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                    }}
                                >
                                    <span style={{ fontSize: 22 }}>{tier.emoji}</span>
                                    {tier.title}
                                </div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: 12,
                                        color: "#555",
                                        marginTop: 4,
                                    }}
                                >
                                    {tier.description}
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 16,
                                    flexShrink: 0,
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "var(--font-syne)",
                                        fontWeight: 900,
                                        fontSize: 24,
                                        color: "#FF3B30",
                                    }}
                                >
                                    ₹{tier.amount}
                                </span>
                                <button
                                    style={buttonStyle}
                                    onClick={() => handlePayment(tier.amount)}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.background = "#e0332a")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.background = "#FF3B30")
                                    }
                                >
                                    Send ₹{tier.amount}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Custom Amount */}
                <div
                    style={{
                        marginTop: 16,
                        background: "#0a0a0a",
                        border: "1px solid #1a1a1a",
                        padding: "28px 32px",
                    }}
                >
                    <div
                        style={{
                            fontFamily: "var(--font-syne)",
                            fontWeight: 800,
                            fontSize: 18,
                            color: "#fff",
                        }}
                    >
                        Name Your Number
                    </div>
                    <div
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: "#555",
                            marginTop: 4,
                        }}
                    >
                        Any amount. No pressure. Even ₹1 means you believe in us.
                    </div>
                    <div
                        style={{
                            display: "flex",
                            gap: 16,
                            alignItems: "center",
                            marginTop: 24,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span
                                style={{
                                    fontFamily: "var(--font-syne)",
                                    fontWeight: 900,
                                    fontSize: 24,
                                    color: "#FF3B30",
                                }}
                            >
                                ₹
                            </span>
                            <input
                                type="number"
                                min={1}
                                placeholder="420"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    borderBottom: "1px solid #333",
                                    color: "#fff",
                                    fontFamily: "var(--font-syne)",
                                    fontWeight: 900,
                                    fontSize: 24,
                                    width: 140,
                                    outline: "none",
                                    transition: "border-color 0.3s ease",
                                }}
                                onFocus={(e) =>
                                    (e.currentTarget.style.borderBottomColor = "#FF3B30")
                                }
                                onBlur={(e) =>
                                    (e.currentTarget.style.borderBottomColor = "#333")
                                }
                            />
                        </div>
                        <button
                            style={buttonStyle}
                            onClick={handleCustomSend}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "#e0332a")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background = "#FF3B30")
                            }
                        >
                            Send It →
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <div
                    style={{
                        width: "100%",
                        height: 1,
                        background: "#1a1a1a",
                        margin: "48px 0",
                    }}
                />

                {/* How it works */}
                <div
                    style={{
                        padding: 32,
                        border: "1px solid #1a1a1a",
                        background: "#050505",
                    }}
                >
                    <div
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            color: "#FF3B30",
                            letterSpacing: 4,
                            marginBottom: 24,
                        }}
                    >
                        {`// How it works`}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 16,
                        }}
                    >
                        {[
                            "Pick an amount above or enter your own.",
                            "Click Send and you\u2019ll be redirected to UPI payment via EasyPay.",
                            "Done. You just fueled Vadodara\u2019s first hacker house. Respect.",
                        ].map((text, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    gap: 16,
                                    alignItems: "flex-start",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "var(--font-syne)",
                                        fontWeight: 900,
                                        fontSize: 13,
                                        color: "#FF3B30",
                                        width: 24,
                                        flexShrink: 0,
                                    }}
                                >
                                    0{i + 1}
                                </span>
                                <span
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: 12,
                                        color: "#555",
                                        lineHeight: 1.7,
                                    }}
                                >
                                    {text}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            color: "#333",
                            marginTop: 24,
                        }}
                    >
                        Payments processed securely via EasyPay UPI. No account needed.
                    </div>
                </div>

                {/* Quote */}
                <div
                    style={{
                        borderLeft: "2px solid #FF3B30",
                        paddingLeft: 24,
                        margin: "48px 0",
                    }}
                >
                    <div
                        style={{
                            fontFamily: "var(--font-syne)",
                            fontWeight: 700,
                            fontStyle: "italic",
                            fontSize: 20,
                            color: "#333",
                            lineHeight: 1.5,
                        }}
                    >
                        &ldquo;Every rupee here is a line of code, a domain renewed,
                        or a pizza at 2am that kept someone building.&rdquo;
                    </div>
                    <div
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            color: "#444",
                            marginTop: 12,
                        }}
                    >
                        — The Founders, Thesidejob
                    </div>
                </div>

                {/* Back link */}
                <a
                    href="/"
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "#444",
                        textDecoration: "none",
                        display: "inline-block",
                        marginTop: 48,
                        transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B30")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}
                >
                    ← Back to Thesidejob
                </a>
            </div>

            {/* Payment Modal */}
            {showQR && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.95)",
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "24px",
                    }}
                >
                    <div
                        style={{
                            background: "#0a0a0a",
                            border: "1px solid #1a1a1a",
                            padding: "32px 24px",
                            maxWidth: 360,
                            width: "100%",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            textAlign: "center",
                            position: "relative",
                        }}
                        className="hide-scrollbar"
                    >
                        <button
                            onClick={() => setShowQR(false)}
                            style={{
                                position: "absolute",
                                top: 16,
                                right: 16,
                                fontFamily: "var(--font-mono)",
                                fontSize: 12,
                                color: "#333",
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                transition: "color 0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
                        >
                            ✕ Close
                        </button>

                        <div
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 11,
                                color: "#FF3B30",
                                letterSpacing: 4,
                                marginBottom: 16,
                            }}
                        >
                            // Scan to Pay
                        </div>

                        <div
                            style={{
                                fontFamily: "var(--font-syne)",
                                fontWeight: 900,
                                fontSize: 48,
                                color: "#fff",
                                marginBottom: 16,
                            }}
                        >
                            ₹{selectedAmount}
                        </div>

                        <img
                            src="/qr-code.jpeg"
                            alt="PhonePe QR Code"
                            style={{
                                border: "4px solid #1a1a1a",
                                borderRadius: 12,
                                marginBottom: 16,
                                width: "100%",
                                maxWidth: 220,
                                height: "auto",
                                objectFit: "contain",
                                margin: "0 auto 16px auto",
                                display: "block"
                            }}
                        />

                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#555" }}>
                            Scan with GPay, PhonePe, Paytm or any UPI app
                        </div>

                        <div style={{
                            background: "#111", padding: 16, marginTop: 24,
                            fontFamily: "var(--font-mono)", fontSize: 14, color: "#FF3B30", letterSpacing: 2
                        }}>
                            {upiIdForQr}
                        </div>

                        <button
                            onClick={handleCopy}
                            style={{
                                border: "1px solid #333",
                                color: copied ? "#32D74B" : "#555",
                                fontFamily: "var(--font-mono)",
                                fontSize: 12,
                                padding: "12px 24px",
                                background: "transparent",
                                cursor: "pointer",
                                marginTop: 16,
                                transition: "all 0.3s ease",
                            }}
                        >
                            {copied ? "Copied ✓" : "Copy UPI ID"}
                        </button>

                        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 24 }}>
                            <a href={gPayLink} style={{
                                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2,
                                border: "1px solid #222", color: "#444", padding: "10px 16px", textDecoration: "none",
                                transition: "all 0.2s"
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#FF3B30"; e.currentTarget.style.color = "#FF3B30"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.color = "#444"; }}
                            >
                                Open GPay
                            </a>
                            <a href={phonePeLink} style={{
                                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2,
                                border: "1px solid #222", color: "#444", padding: "10px 16px", textDecoration: "none",
                                transition: "all 0.2s"
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#FF3B30"; e.currentTarget.style.color = "#FF3B30"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.color = "#444"; }}
                            >
                                Open PhonePe
                            </a>
                            <a href={paytmLink} style={{
                                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 2,
                                border: "1px solid #222", color: "#444", padding: "10px 16px", textDecoration: "none",
                                transition: "all 0.2s"
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#FF3B30"; e.currentTarget.style.color = "#FF3B30"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.color = "#444"; }}
                            >
                                Open Paytm
                            </a>
                        </div>

                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#333", marginTop: 24 }}>
                            After paying, screenshot and share on Charcha #general — we'll shout you out 🔴
                        </div>

                        <button
                            onClick={() => setShowQR(false)}
                            style={{
                                marginTop: 24,
                                background: "none",
                                border: "1px solid #333",
                                color: "#888",
                                fontFamily: "var(--font-mono)",
                                fontSize: 12,
                                padding: "12px 24px",
                                width: "100%",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#555"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#333"; }}
                        >
                            Cancel Payment
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type="number"] {
                    -moz-appearance: textfield;
                }
                input::placeholder {
                    color: #333;
                }
                @media (max-width: 768px) {
                    .support-wrapper { padding: 100px 16px 60px !important; }
                    .support-nav { padding: 16px 20px !important; }
                    .support-headline { font-size: clamp(40px, 10vw, 60px) !important; }
                }
                @media (max-width: 600px) {
                    .support-card {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 16px !important;
                    }
                }
            `}</style>
        </div>
    );
}
