import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Charcha — Thesidejob",
    description: "Baat karo. Build karo. Thesidejob's community chat for hackers and founders.",
};

export default function CommunityLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
