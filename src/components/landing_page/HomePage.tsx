import Head from "next/head";
import { Feather } from "lucide-react";
import FAQs from "./FAQ";
import Hero from "./HeroSection";
import Navbar from "./NavBar";
import FeatureSection from "./Features";
import Footer from "./Footer";
import PresenceBoostGuide from "./PresenceBoost";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Med Genie - Your AI Health Assistant</title>
        <meta
          name="description"
          content="Get instant AI-powered health advice and medical information. Ask questions about symptoms, treatments, and general health guidance with our intelligent medical chatbot."
        />
        {/* ✅ Favicon and icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <Navbar />
      <Hero />
      <FeatureSection />
      <PresenceBoostGuide />
      <FAQs />
      <Footer />
    </>
  );
}
