"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "@/hooks/useLenis";

function SmoothScrollInner({ children }: { children: React.ReactNode }) {
    useLenis();
    return <div>{children}</div>;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Disable Lenis smooth scroll on community/charcha page — it manages its own scroll
    if (pathname === "/community") {
        return <div>{children}</div>;
    }

    return <SmoothScrollInner>{children}</SmoothScrollInner>;
}
