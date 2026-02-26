"use client";

import { useEffect, useRef, useState, memo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

const NAV_LINKS = [
    { label: "SERVICES", href: "#services" },
    { label: "WORK", href: "#work" },
    { label: "ABOUT", href: "#about" },
    { label: "IDEAS", href: "/ideas" },
];

function LoginLink({ onClick, activeId, isMobile, i, menuOpen }: { onClick?: () => void, activeId?: string, isMobile?: boolean, i?: number, menuOpen?: boolean }) {
    const { user, profile, loading } = useAuth();

    if (loading) return null;

    let label = "LOGIN";
    let linkHref = "/login";
    let displayColor = isMobile ? "#fff" : undefined;

    if (user) {
        let displayName = profile?.username ? profile.username.toUpperCase() : "ACCOUNT";
        if (displayName.length > 10) displayName = displayName.substring(0, 8);
        label = `HI, ${displayName}`;
        linkHref = "/account";
        displayColor = "#fff";
    }

    if (isMobile) {
        return (
            <Link
                href={linkHref}
                onClick={onClick}
                style={{
                    fontFamily: "var(--font-syne)",
                    fontWeight: 900,
                    fontSize: "10vw",
                    color: displayColor || "#fff",
                    textDecoration: "none",
                    letterSpacing: -2,
                    textTransform: "uppercase",
                    transition: "all 0.3s ease",
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: `${0.1 + (i || 0) * 0.1}s`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B30")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
            >
                {label}
            </Link>
        );
    }

    return (
        <Link
            href={linkHref}
            className={`nav-link magnetic ${activeId === 'login' ? 'active' : ''}`}
            onClick={onClick}
            style={{ color: displayColor }}
        >
            {label}
        </Link>
    );
}


function NavLink({ label, href, activeId, onClick }: { label: string; href: string; activeId?: string; onClick?: () => void }) {
    const ref = useRef<HTMLAnchorElement>(null);
    useMagneticEffect(ref, 0.2);
    const isActive = activeId === href.replace('#', '');
    return (
        <a
            ref={ref}
            href={href}
            className={`nav-link magnetic ${isActive ? "active" : ""}`}
            onClick={onClick}
            data-text={label}
        >
            {label}
        </a>
    );
}

function CharchaLink({ onClick, isActive }: { onClick?: () => void, isActive?: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();
    useMagneticEffect(ref, 0.2);

    const handleCharchaClick = async () => {
        onClick?.();
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            router.push("/community");
        } else {
            router.push("/login");
        }
    };

    return (
        <div
            ref={ref}
            className={`nav-link magnetic ${isActive ? "active" : ""}`}
            onClick={handleCharchaClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter") handleCharchaClick(); }}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
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
        </div>
    );
}

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeId, setActiveId] = useState("");
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);

            const sections = NAV_LINKS.map(link => document.getElementById(link.href.replace('#', ''))).filter(Boolean) as HTMLElement[];
            if (sections.length === 0) return;

            let currentActive = "";
            let minDistance = Infinity;
            const viewportCenter = window.innerHeight / 2;

            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const distance = Math.abs(rect.top - viewportCenter);

                if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
                    currentActive = section.id;
                    minDistance = 0;
                } else if (distance < minDistance && minDistance !== 0) {
                    minDistance = distance;
                    currentActive = section.id;
                }
            });

            if (currentActive) {
                setActiveId(currentActive);
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
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
                    padding: scrolled ? "16px 48px" : "24px 48px",
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
                    className="logo-container"
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
                    <span className="logo-dot">
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
                        <NavLink key={link.href} {...link} activeId={activeId} />
                    ))}
                    <LoginLink activeId={activeId} />

                    {/* Support Link */}
                    <Link
                        href="/support"
                        className={`nav-link magnetic ${pathname === "/support" ? "active" : ""}`}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <span style={{ color: "#FF3B30" }}>♥</span>
                        SUPPORT
                    </Link>

                    <CharchaLink />

                    {/* Get in Touch Button */}
                    <a
                        href="#contact"
                        className="nav-cta-btn"
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
                        gap: 6,
                        width: 32,
                        alignItems: "flex-end",
                    }}
                >
                    <span
                        style={{
                            display: "block",
                            height: 2,
                            width: "100%",
                            background: menuOpen ? "#FF3B30" : "#fff",
                            borderRadius: 1,
                            transition: "all 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
                            transform: menuOpen ? "rotate(45deg) translateY(6px) translateX(5px)" : "none",
                            transformOrigin: "center",
                        }}
                    />
                    <span
                        style={{
                            display: "block",
                            height: 2,
                            width: menuOpen ? "0%" : "70%",
                            background: "#fff",
                            borderRadius: 1,
                            transition: "all 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
                            opacity: menuOpen ? 0 : 1,
                        }}
                    />
                    <span
                        style={{
                            display: "block",
                            height: 2,
                            width: "100%",
                            background: menuOpen ? "#FF3B30" : "#fff",
                            borderRadius: 1,
                            transition: "all 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
                            transform: menuOpen ? "rotate(-45deg) translateY(-6px) translateX(5px)" : "none",
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
                    background: "#000",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 24,
                    opacity: menuOpen ? 1 : 0,
                    visibility: menuOpen ? "visible" : "hidden",
                    pointerEvents: menuOpen ? "auto" : "none",
                    transition: "all 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
                    backdropFilter: "blur(20px)",
                }}
            >
                {/* Mobile Menu Links */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                    {NAV_LINKS.map((link, i) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={closeMenu}
                            style={{
                                fontFamily: "var(--font-syne)",
                                fontWeight: 900,
                                fontSize: "10vw",
                                color: "#fff",
                                textDecoration: "none",
                                letterSpacing: -2,
                                textTransform: "uppercase",
                                transition: "all 0.3s ease",
                                opacity: menuOpen ? 1 : 0,
                                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                                transitionDelay: `${0.1 + i * 0.1}s`,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B30")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
                        >
                            {link.label}
                        </a>
                    ))}
                    <LoginLink isMobile={true} i={NAV_LINKS.length} onClick={closeMenu} menuOpen={menuOpen} />
                </div>

                <div
                    style={{
                        width: 40,
                        height: 1,
                        background: "#FF3B30",
                        margin: "20px 0",
                        opacity: menuOpen ? 1 : 0,
                        transition: "all 0.5s ease",
                        transitionDelay: "0.5s"
                    }}
                />

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                    <Link
                        href="/support"
                        onClick={closeMenu}
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: "#555",
                            textDecoration: "none",
                            letterSpacing: 4,
                            textTransform: "uppercase",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            opacity: menuOpen ? 1 : 0,
                            transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                            transitionDelay: "0.6s",
                        }}
                    >
                        <span style={{ color: "#FF3B30" }}>♥</span>
                        SUPPORT
                    </Link>

                    <div
                        style={{
                            opacity: menuOpen ? 1 : 0,
                            transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                            transitionDelay: "0.7s",
                        }}
                    >
                        <CharchaLink onClick={closeMenu} />
                    </div>

                    <a
                        href="#contact"
                        onClick={closeMenu}
                        style={{
                            marginTop: 10,
                            fontFamily: "var(--font-syne)",
                            fontWeight: 700,
                            fontSize: 14,
                            color: "#000",
                            textDecoration: "none",
                            padding: "16px 40px",
                            background: "#FF3B30",
                            borderRadius: 999,
                            opacity: menuOpen ? 1 : 0,
                            transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                            transitionDelay: "0.8s",
                        }}
                    >
                        Get in Touch
                    </a>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .main-nav {
                        padding: 16px 24px !important;
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
