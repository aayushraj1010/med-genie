"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import HomePage from "@/components/landing_page/HomePage";
import './globals.css'
import Navbar from "@/components/landing_page/NavBar";
import Hero from "@/components/landing_page/HeroSection";
import FeatureSection from "@/components/landing_page/Features";
import PresenceBoostGuide from "@/components/landing_page/PresenceBoost";
import FAQs from "@/components/landing_page/FAQ";
import Footer from "@/components/landing_page/Footer";
import ContactSection from "@/components/landing_page/ContactSection";
import Preloader from "@/components/Preloader";
import Layout from "@/components/layout";

export default function App(){
   useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
    setTimeout(() => {
      AOS.refreshHard();
    }, 800);
  }, [])

  return (<>
  <Preloader />
  <main>
   <Layout>
    <Hero/>
    <FeatureSection/>
    <PresenceBoostGuide/>
    <FAQs/>
    </Layout>

    </main>
  </>)
}


