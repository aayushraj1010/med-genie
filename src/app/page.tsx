"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import "./globals.css";
import Navbar from "@/components/landing_page/NavBar";
import Hero from "@/components/landing_page/HeroSection";
import FeatureSection from "@/components/landing_page/Features";
import PresenceBoostGuide from "@/components/landing_page/PresenceBoost";
import FAQs from "@/components/landing_page/FAQ";
import Footer from "@/components/landing_page/Footer";
import Preloader from "@/components/Preloader";
import TrustBadges from "@/components/TrustBadges";

export default function App() {
  useEffect(() => {
    try {
      AOS.init({
        duration: 800,
        once: true,
      });
    } catch (err) {
      // ignore AOS errors in environments where it isn't available
      // eslint-disable-next-line no-console
      console.warn('AOS init failed', err);
    }

    const t = setTimeout(() => {
      try {
        AOS.refreshHard();
      } catch {
        // ignore
      }
    }, 800);

    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Preloader />
      <Navbar />
      <Hero />
      <TrustBadges />
      <FeatureSection />
      <PresenceBoostGuide />
      <FAQs />
      <Footer />
    </>
  );
}