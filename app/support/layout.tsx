import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Support — Thesidejob",
    description:
        "Fuel Vadodara's first hacker house. Support Thesidejob and keep the builders building.",
};

export default function SupportLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
