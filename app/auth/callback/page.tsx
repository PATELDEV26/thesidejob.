"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const handleCallback = async () => {
            // Supabase-js automatically attempts to exchange code for session
            // when initialized if the URL contains a code parameter.
            // We manually ensure the session is retrieved/exchanged properly.
            const { data, error } = await supabase.auth.getSession();

            if (error && mounted) {
                console.error("Auth callback error:", error);
                setErrorMsg("Failed to authenticate. Please try again.");
                return;
            }

            if (data.session && mounted) {
                // Redirect to homepage or original destination
                const searchParams = new URLSearchParams(window.location.search);
                const next = searchParams.get('next') || '/';
                router.push(next);
            }
        };

        // A small delay lets supabase-js parse the URL parameters
        // and complete the implicit auth cycle before we redirect.
        const timer = setTimeout(() => {
            handleCallback();
        }, 500);

        return () => {
            mounted = false;
            clearTimeout(timer);
        };
    }, [router]);

    return (
        <div style={{
            background: "#000",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 14,
            flexDirection: "column",
            gap: 16
        }}>
            {errorMsg ? (
                <>
                    <div style={{ color: "#FF3B30" }}>{errorMsg}</div>
                    <button
                        onClick={() => router.push('/')}
                        style={{
                            background: "#111",
                            border: "1px solid #333",
                            color: "#fff",
                            padding: "8px 16px",
                            cursor: "pointer",
                            fontFamily: "inherit"
                        }}
                    >
                        Return Home
                    </button>
                </>
            ) : (
                <>
                    <div className="loader" style={{ width: 24, height: 24, border: "2px solid #333", borderTopColor: "#FF3B30", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                    <div>Authenticating...</div>
                </>
            )}
            <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
