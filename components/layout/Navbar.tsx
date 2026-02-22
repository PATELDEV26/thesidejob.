"use client";

import { useEffect, useRef, useState, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

const NAV_LINKS = [
    { label: "SERVICES", href: "#services" },
    { label: "WORK", href: "#work" },
    { label: "ABOUT", href: "#about" },
    { label: "CONTACT", href: "#contact" },
];

function NavLink({ label, href, onClick }: { label: string; href: string; onClick?: () => void }) {
    const ref = useRef<HTMLAnchorElement>(null);
    useMagneticEffect(ref, 0.2);
    return (
        <a
            ref={ref}
            href={href}
            className="nav-link magnetic"
            onClick={onClick}
            style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: 3,
                color: "#555",
                textDecoration: "none",
                textTransform: "uppercase",
                transition: "color 0.3s ease",
                padding: "8px 4px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
        >
            {label}
        </a>
    );
}

function CharchaLink({ onClick }: { onClick?: () => void }) {
    const ref = useRef<HTMLAnchorElement>(null);
    useMagneticEffect(ref, 0.2);

    return (
        <Link
            ref={ref}
            href="/community"
            className="nav-link magnetic"
            onClick={onClick}
            style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: 3,
                color: "#555",
                textDecoration: "none",
                textTransform: "uppercase",
                transition: "color 0.3s ease",
                padding: "8px 4px",
                display: "flex",
                alignItems: "center",
                gap: 6,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.color = "#555";
            }}
        >
            <span
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#FF3B30",
                    display: "inline-block",
                }}
            />
            CHARCHA
        </Link>
    );
}

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    // Hide navbar on community page
    if (pathname === "/community") return null;

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            <nav
                className="main-nav"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    padding: scrolled ? "18px 48px" : "28px 48px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: scrolled ? "rgba(0,0,0,0.85)" : "transparent",
                    backdropFilter: scrolled ? "blur(20px)" : "none",
                    borderBottom: scrolled
                        ? "1px solid rgba(255,59,48,0.15)"
                        : "1px solid transparent",
                    transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
            >
                {/* Logo */}
                <a
                    href="#hero"
                    style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 900,
                        fontSize: 18,
                        color: "#fff",
                        textDecoration: "none",
                        letterSpacing: "-0.5px",
                        zIndex: 1010,
                    }}
                >
                    Thesidejob
                    <span className="period-pulse" style={{ color: "#FF3B30" }}>
                        .
                    </span>
                </a>

                {/* Desktop Nav Links */}
                <div className="nav-desktop-links"
                    style={{
                        display: "flex",
                        gap: 32,
                        alignItems: "center",
                    }}
                >
                    {NAV_LINKS.map((link) => (
                        <NavLink key={link.href} {...link} />
                    ))}

                    {/* Support Link */}
                    <Link
                        href="/support"
                        className="nav-link magnetic"
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            letterSpacing: 3,
                            color: "#555",
                            textDecoration: "none",
                            textTransform: "uppercase",
                            transition: "color 0.3s ease",
                            padding: "8px 4px",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                    >
                        <span style={{ color: "#FF3B30" }}>♥</span>
                        SUPPORT
                    </Link>

                    <CharchaLink />

                    {/* Get in Touch Button */}
                    <a
                        href="#contact"
                        className="nav-cta-btn"
                        style={{
                            marginLeft: 16,
                            fontFamily: "var(--font-syne)",
                            fontWeight: 700,
                            fontSize: 13,
                            color: "#fff",
                            textDecoration: "none",
                            padding: "12px 24px",
                            border: "1px solid #333",
                            borderRadius: 999,
                            background: "transparent",
                            transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#FF3B30";
                            e.currentTarget.style.borderColor = "#FF3B30";
                            e.currentTarget.style.color = "#000";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.borderColor = "#333";
                            e.currentTarget.style.color = "#fff";
                        }}
                    >
                        Get in Touch
                    </a>
                </div>

                {/* Hamburger Button (mobile only) */}
                <button
                    className="nav-hamburger"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                    style={{
                        display: "none",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 8,
                        zIndex: 1010,
                        flexDirection: "column",
                        gap: 5,
                        width: 32,
                        alignItems: "stretch",
                    }}
                >
                    <span
                        style={{
                            display: "block",
                            height: 2,
                            background: menuOpen ? "#FF3B30" : "#fff",
                            borderRadius: 1,
                            transition: "all 0.3s ease",
                            transform: menuOpen ? "rotate(45deg) translateY(5px)" : "none",
                            transformOrigin: "center",
                        }}
                    />
                    <span
                        style={{
                            display: "block",
                            height: 2,
                            background: menuOpen ? "transparent" : "#fff",
                            borderRadius: 1,
                            transition: "all 0.3s ease",
                        }}
                    />
                    <span
                        style={{
                            display: "block",
                            height: 2,
                            background: menuOpen ? "#FF3B30" : "#fff",
                            borderRadius: 1,
                            transition: "all 0.3s ease",
                            transform: menuOpen ? "rotate(-45deg) translateY(-5px)" : "none",
                            transformOrigin: "center",
                        }}
                    />
                </button>
            </nav>

            {/* Mobile Full-Screen Menu Overlay */}
            <div
                className="nav-mobile-overlay"
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 999,
                    background: "rgba(0,0,0,0.97)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 32,
                    opacity: menuOpen ? 1 : 0,
                    pointerEvents: menuOpen ? "auto" : "none",
                    transition: "opacity 0.4s ease",
                    backdropFilter: "blur(20px)",
                }}
            >
                {NAV_LINKS.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        onClick={closeMenu}
                        style={{
                            fontFamily: "var(--font-syne)",
                            fontWeight: 900,
                            fontSize: 28,
                            color: "#fff",
                            textDecoration: "none",
                            letterSpacing: 2,
                            textTransform: "uppercase",
                            transition: "color 0.3s ease",
                        }}
                    >
                        {link.label}
                    </a>
                ))}

                <div style={{ width: 40, height: 1, background: "#FF3B30", margin: "8px 0" }} />

                <Link
                    href="/support"
                    onClick={closeMenu}
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 14,
                        color: "#555",
                        textDecoration: "none",
                        letterSpacing: 3,
                        textTransform: "uppercase",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <span style={{ color: "#FF3B30" }}>♥</span>
                    SUPPORT
                </Link>

                <CharchaLink onClick={closeMenu} />

                <a
                    href="#contact"
                    onClick={closeMenu}
                    style={{
                        marginTop: 16,
                        fontFamily: "var(--font-syne)",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#000",
                        textDecoration: "none",
                        padding: "16px 40px",
                        background: "#FF3B30",
                        borderRadius: 999,
                    }}
                >
                    Get in Touch
                </a>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .main-nav {
                        padding: 16px 20px !important;
                    }
                    .nav-desktop-links {
                        display: none !important;
                    }
                    .nav-hamburger {
                        display: flex !important;
                    }
                }
            `}</style>
        </>
    );
}

export default memo(Navbar);
