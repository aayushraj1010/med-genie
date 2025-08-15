import { Feather } from "lucide-react";
import FAQs from "./FAQ";
import Hero from "./HeroSection";
import Navbar from "./NavBar";
import FeatureSection from "./Features";
import Footer from "./Footer";
import PresenceBoostGuide from "./PresenceBoost";

export default function HomePage(){
    return (<>
    <Navbar/>
    <Hero/>
    <FeatureSection/>
    <PresenceBoostGuide/>
    <FAQs/>
    <Footer/>
    </>)
}