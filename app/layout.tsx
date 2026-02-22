import type { Metadata, Viewport } from "next";
import { Syne, Space_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import PageLoader from "@/components/ui/PageLoader";
import Navbar from "@/components/layout/Navbar";
import ScrollProgress from "@/components/ui/ScrollProgress";
import PageTransition from "@/components/ui/PageTransition";
import KonamiCodeWrapper from "@/components/ui/KonamiCodeWrapper";

const syne = Syne({
    subsets: ["latin"],
    weight: ["400", "700", "800"],
    variable: "--font-syne",
    display: "swap",
});

const spaceMono = Space_Mono({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-mono",
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL('https://thesidejob.vercel.app'),
    title: {
        template: "%s | Thesidejob",
        default: "TSJ — Thesidejob",
    },
    description:
        "We build what others dream. A collective of designers, engineers, and dreamers building the next generation of digital products.",
    keywords:
        "digital agency, web development, product design, thesidejob, vadodara",
    icons: {
        icon: "/favicon.svg",
        shortcut: "/favicon.svg",
        apple: "/favicon.svg",
    },
    openGraph: {
        title: "TSJ — Thesidejob",
        description:
            "We build what others dream. A collective of designers, engineers, and dreamers building the next generation of digital products.",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${syne.variable} ${spaceMono.variable}`}>
            <body>
                <ScrollProgress />
                <PageLoader />
                <CustomCursor />
                <Navbar />
                <KonamiCodeWrapper />
                <SmoothScroll>
                    <PageTransition>{children}</PageTransition>
                </SmoothScroll>
            </body>
        </html>
    );
}
