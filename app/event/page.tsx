import EventSection from "@/components/sections/EventSection";
import Footer from "@/components/layout/Footer";

export default function EventPage() {
    return (
        <div className="page-wrapper" style={{ overflowX: "hidden", background: "#050505", minHeight: "100vh" }}>
            <main style={{ paddingTop: "80px" }}>
                <EventSection />
            </main>
            <Footer />
        </div>
    );
}
