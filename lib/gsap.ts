"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

export { ScrollTrigger, TextPlugin };
export default gsap;
