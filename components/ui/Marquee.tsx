"use client";

import { useEffect, useRef } from "react";

const ROW1_TEXT =
    "BUILD · HACK · LAUNCH · SHIP · REPEAT · BUILD · HACK · LAUNCH · SHIP · REPEAT · BUILD · HACK · LAUNCH · SHIP · REPEAT · BUILD · HACK · LAUNCH · SHIP · REPEAT · ";
const ROW2_TEXT =
    "VADODARA · PARUL UNIVERSITY · HACKER HOUSE · SIDE PROJECTS · VADODARA · PARUL UNIVERSITY · HACKER HOUSE · SIDE PROJECTS · VADODARA · PARUL UNIVERSITY · HACKER HOUSE · SIDE PROJECTS · VADODARA · PARUL UNIVERSITY · HACKER HOUSE · SIDE PROJECTS · ";

export default function Marquee() {
    return (
        <div style={{ overflow: "hidden", userSelect: "none" }}>
            {/* Row 1 — Red background, scroll left */}
            <div
                style={{
                    background: "#FF3B30",
                    padding: "14px 0",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        whiteSpace: "nowrap",
                        animation: "marqueeLeft 20s linear infinite",
                    }}
                >
                    <span
                        style={{
                            fontFamily: "var(--font-syne)",
                            fontWeight: 900,
                            fontSize: 13,
                            letterSpacing: 4,
                            color: "#000",
                            textTransform: "uppercase",
                            paddingRight: 0,
                        }}
                    >
                        {ROW1_TEXT}
                    </span>
                    <span
                        style={{
                            fontFamily: "var(--font-syne)",
                            fontWeight: 900,
                            fontSize: 13,
                            letterSpacing: 4,
                            color: "#000",
                            textTransform: "uppercase",
                        }}
                    >
                        {ROW1_TEXT}
                    </span>
                </div>
            </div>

            {/* Row 2 — Black background, scroll right */}
            <div
                style={{
                    background: "#000",
                    padding: "14px 0",
                    overflow: "hidden",
                    borderTop: "1px solid #111",
                    borderBottom: "1px solid #111",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        whiteSpace: "nowrap",
                        animation: "marqueeRight 25s linear infinite",
                    }}
                >
                    <span
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            letterSpacing: 3,
                            color: "#fff",
                            textTransform: "uppercase",
                            opacity: 0.5,
                        }}
                    >
                        {ROW2_TEXT}
                    </span>
                    <span
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            letterSpacing: 3,
                            color: "#fff",
                            textTransform: "uppercase",
                            opacity: 0.5,
                        }}
                    >
                        {ROW2_TEXT}
                    </span>
                </div>
            </div>

            <style jsx>{`
        @keyframes marqueeLeft {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @keyframes marqueeRight {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
        div:hover > div {
          animation-play-state: paused !important;
        }
      `}</style>
        </div>
    );
}
