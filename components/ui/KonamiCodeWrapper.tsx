"use client";

import { usePathname } from "next/navigation";
import { useKonamiCode, KonamiOverlay } from "@/hooks/useKonamiCode";

export default function KonamiCodeWrapper() {
    const pathname = usePathname();
    const { activated, close } = useKonamiCode();

    // Only show on main site
    if (pathname === "/community") return null;

    return <KonamiOverlay activated={activated} close={close} />;
}
