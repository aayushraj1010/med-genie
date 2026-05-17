import FAQs from "./FAQ";
import Hero from "./HeroSection";
import Navbar from "./NavBar";
import FeatureSection from "./Features";
import Footer from "./Footer";
import PresenceBoostGuide from "./PresenceBoost";
import PageWrapper from "./PageWrapper";

export default function HomePage() {
    return (
        <>
            <Navbar />
            <PageWrapper>
                <Hero />
                <FeatureSection />
                <PresenceBoostGuide />
                <FAQs />
                <Footer />
            </PageWrapper>
        </>
    );
}