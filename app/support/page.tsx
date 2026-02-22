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
    const [showModal, setShowModal] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [copied, setCopied] = useState(false);

    const handlePay = (amount: number) => {
        setSelectedAmount(amount);
        const upiLink = `upi://pay?pa=thesidejob@upi&pn=Thesidejob&am=${amount}&cu=INR&tn=Supporting+Thesidejob+Hacker+House`;
        window.open(upiLink, "_blank");
        setShowModal(true);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText("thesidejob@upi");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCustomSend = () => {
        const amt = parseInt(customAmount);
        if (amt && amt >= 1) {
            handlePay(amt);
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

    return (
        <div style={{ background: "#000", minHeight: "100vh" }}>
            {/* Fixed top nav for Support page */}
            <nav
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
                                    onClick={() => handlePay(tier.amount)}
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
            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.9)",
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        style={{
                            background: "#0a0a0a",
                            border: "1px solid #1e1e1e",
                            padding: 48,
                            maxWidth: 400,
                            width: "90%",
                            textAlign: "center",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            style={{
                                fontFamily: "var(--font-syne)",
                                fontWeight: 900,
                                fontSize: 24,
                                color: "#fff",
                            }}
                        >
                            Payment Initiated
                        </div>
                        <div
                            style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 12,
                                color: "#555",
                                marginTop: 12,
                                marginBottom: 32,
                            }}
                        >
                            If your UPI app didn&apos;t open automatically, use the
                            details below:
                        </div>
                        <div
                            style={{
                                background: "#111",
                                border: "1px solid #1a1a1a",
                                padding: 16,
                                fontFamily: "var(--font-mono)",
                                fontSize: 14,
                                color: "#FF3B30",
                                letterSpacing: 2,
                                textAlign: "center",
                            }}
                        >
                            thesidejob@upi
                        </div>
                        <div
                            style={{
                                fontFamily: "var(--font-syne)",
                                fontWeight: 900,
                                fontSize: 48,
                                color: "#fff",
                                marginTop: 16,
                            }}
                        >
                            ₹{selectedAmount}
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
                                marginTop: 24,
                                transition: "all 0.3s ease",
                                borderColor: copied ? "#32D74B" : "#333",
                            }}
                            onMouseEnter={(e) => {
                                if (!copied) {
                                    e.currentTarget.style.borderColor = "#FF3B30";
                                    e.currentTarget.style.color = "#FF3B30";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!copied) {
                                    e.currentTarget.style.borderColor = "#333";
                                    e.currentTarget.style.color = "#555";
                                }
                            }}
                        >
                            {copied ? "Copied ✓" : "Copy UPI ID"}
                        </button>
                        <div>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 11,
                                    color: "#333",
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    marginTop: 16,
                                    transition: "color 0.3s ease",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.color = "#fff")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.color = "#333")
                                }
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
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
