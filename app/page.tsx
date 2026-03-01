import Hero from "@/components/sections/Hero";
import Marquee from "@/components/ui/Marquee";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import OurWork from "@/components/sections/OurWork";
import Stats from "@/components/sections/Stats";
import JoinUs from "@/components/sections/JoinUs";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/ui/FloatingCTA";
import SectionIndicator from "@/components/ui/SectionIndicator";

export default function Home() {
    return (
        <div className="page-wrapper" style={{ overflowX: "hidden" }}>
            <main>
                <Hero />
                <Marquee />
                <About />
                <Services />
                <OurWork />
                <Stats />
                <JoinUs />
            </main>
            <Footer />
            <FloatingCTA />
            <SectionIndicator />
        </div>
    );
}
