import HomePage from "@/components/landing_page/HomePage";
import './globals.css'
import Navbar from "@/components/landing_page/NavBar";
import Hero from "@/components/landing_page/HeroSection";
import FeatureSection from "@/components/landing_page/Features";
import PresenceBoostGuide from "@/components/landing_page/PresenceBoost";
import FAQs from "@/components/landing_page/FAQ";
import Footer from "@/components/landing_page/Footer";
export default function App(){
  return (<>
   <Navbar/>
    <Hero/>
    <FeatureSection/>
    <PresenceBoostGuide/>
    <FAQs/>
    <Footer/>
  </>)
}