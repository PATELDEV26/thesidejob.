"use client";

import React from "react";
import { useLenis } from "@/hooks/useLenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    useLenis();
    return <div>{children}</div>;
}
