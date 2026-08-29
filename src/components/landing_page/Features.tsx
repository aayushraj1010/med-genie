"use client";

import {
  Sparkles,
  ShieldCheck,
  Stethoscope,
  Mic,
  MoonStar,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const themeColor = "rgb(63, 181, 244)";

const features = [
  {
    id: 1,
    title: "Conversational AI",
    desc: "Chat naturally with an AI trained on health-related queries to get instant, reliable answers for common symptoms and medical concerns.",
    icon: <Stethoscope size={40} className="text-[rgb(63,181,244)]" />,
  },
  {
    id: 2,
    title: "Emergency Assistance",
    desc: "Quickly access nearby hospital guidance, emergency numbers, and first-aid tips when time matters most.",
    icon: <ShieldCheck size={40} className="text-[rgb(63,181,244)]" />,
  },
  {
    id: 3,
    title: "Symptom Checker",
    desc: "Describe your symptoms and get possible condition suggestions, empowering you with actionable health insights.",
    icon: <Sparkles size={40} className="text-[rgb(63,181,244)]" />,
  },
  {
    id: 4,
    title: "Voice Input",
    desc: "Speak directly to Med Genie using built-in speech recognition for quick, hands-free health assistance.",
    icon: <Mic size={40} className="text-[rgb(63,181,244)]" />,
  },
  {
    id: 5,
    title: "Theme Toggle",
    desc: "Switch between dark and light modes for a comfortable experience in any environment.",
    icon: <MoonStar size={40} className="text-[rgb(63,181,244)]" />,
  },
  {
    id: 6,
    title: "Privacy-First",
    desc: "No data storage or tracking — your health queries remain private and secure.",
    icon: <ShieldCheck size={40} className="text-[rgb(63,181,244)]" />,
  },
];

export default function FeatureSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of the features container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Apply a smooth spring transition to the scroll progress
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <section className="w-full bg-gradient-to-br px-[6%] py-[100px] flex flex-col items-center gap-[100px] max-md:gap-[60px] max-md:py-[60px] overflow-hidden">
      {/* Animated Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-white text-[42px] font-extrabold text-center max-md:text-[28px] tracking-tight"
      >
        How <span className="bg-gradient-to-r from-[#3FB5F4] to-[#6366F1] bg-clip-text text-transparent">Med Genie</span> Helps You
      </motion.h2>

      <div
        ref={containerRef}
        className="w-full flex flex-col gap-[80px] relative max-w-6xl mx-auto"
      >
        {/* Timeline Connecting Line - Background (inactive track) */}
        <div className="absolute top-[22.5px] bottom-[22.5px] left-[22.5px] -translate-x-1/2 lg:left-1/2 lg:-translate-x-1/2 w-[3px] bg-white/10 rounded-full" />

        {/* Timeline Connecting Line - Active (fills on scroll) */}
        <motion.div
          className="absolute top-[22.5px] bottom-[22.5px] left-[22.5px] -translate-x-1/2 lg:left-1/2 lg:-translate-x-1/2 w-[3px] bg-gradient-to-b from-[#3FB5F4] via-[#6366F1] to-[#3B82F6] origin-top rounded-full shadow-[0_0_12px_rgba(63,181,244,0.5)]"
          style={{
            scaleY: scaleY,
          }}
        />

        {features.map((f, index) => (
          <TimelineRow key={f.id} f={f} index={index} />
        ))}
      </div>
    </section>
  );
}

// Sub-component representing a single row in the timeline
function TimelineRow({ f, index }: { f: typeof features[0]; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
        } else {
          // Once passed, keep active. Only set inactive if it is below the screen center.
          const rect = entry.boundingClientRect;
          const viewportCenter = window.innerHeight / 2;
          if (rect.top > viewportCenter) {
            setIsActive(false);
          } else {
            setIsActive(true);
          }
        }
      },
      {
        rootMargin: "0px 0px -50% 0px", // Intersects when top of element crosses screen center
      }
    );

    if (rowRef.current) {
      observer.observe(rowRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isEven = index % 2 === 0;

  // Animation variants for row elements
  const rowVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  } as const;

  const circleVariants = {
    inactive: {
      scale: 1,
      boxShadow: "0 0 20px rgba(63, 181, 244, 0.3)",
      backgroundColor: "rgba(63, 181, 244, 0.85)",
    },
    active: {
      scale: 1.15,
      boxShadow: "0 0 30px rgba(63, 181, 244, 0.8)",
      backgroundColor: "rgb(63, 181, 244)",
    },
    hover: {
      scale: 1.25,
      boxShadow: "0 0 40px rgba(63, 181, 244, 1.0)",
      backgroundColor: "rgb(63, 181, 244)",
    },
  } as const;

  return (
    <motion.div
      ref={rowRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={rowVariants}
      className="flex flex-row lg:grid lg:grid-cols-9 gap-6 lg:gap-8 items-center w-full relative"
    >
      {/* Desktop Left Side Card Wrapper */}
      <div className="hidden lg:block lg:col-span-4">
        {!isEven && (
          <div className="flex justify-end w-full">
            <Card f={f} isActive={isActive} />
          </div>
        )}
      </div>

      {/* Step Indicator (Centered on Desktop, Left on Mobile) */}
      <div className="w-[45px] flex-shrink-0 flex justify-center z-10 lg:w-auto lg:col-span-1 lg:col-start-5 lg:row-start-1">
        <motion.div
          animate={isActive ? "active" : "inactive"}
          whileHover="hover"
          variants={circleVariants}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 18,
          }}
          className="text-black text-[20px] font-bold w-[45px] h-[45px] rounded-full flex items-center justify-center ring-2 ring-white/10 cursor-pointer transition-shadow duration-300 select-none"
        >
          {f.id}
        </motion.div>
      </div>

      {/* Desktop Right Side Card Wrapper / Mobile Card Wrapper */}
      <div className="flex-1 lg:col-span-4 lg:row-start-1 lg:col-start-6">
        {isEven ? (
          <div className="w-full">
            <Card f={f} isActive={isActive} />
          </div>
        ) : (
          /* Mobile view card for odd indexes */
          <div className="lg:hidden w-full">
            <Card f={f} isActive={isActive} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Reusable Card component with dynamic scroll-activation glow & hover effects
function Card({ f, isActive }: { f: typeof features[0]; isActive: boolean }) {
  const iconVariants = {
    inactive: { rotate: 0, scale: 1 },
    active: {
      rotate: 5,
      scale: 1.05,
      transition: { type: "spring", stiffness: 200, damping: 12 },
    },
    hover: {
      rotate: 15,
      scale: 1.15,
      transition: { type: "spring", stiffness: 300, damping: 10 },
    },
  } as const;

  const cardVariants = {
    inactive: {
      scale: 1,
      boxShadow: "0 0 30px rgba(63, 181, 244, 0.08)",
      borderColor: "rgba(255, 255, 255, 0.1)",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
    active: {
      scale: 1.025,
      boxShadow: "0 0 45px rgba(63, 181, 244, 0.25)",
      borderColor: "rgba(63, 181, 244, 0.45)",
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 0 50px rgba(63, 181, 244, 0.38)",
      borderColor: "rgba(63, 181, 244, 0.6)",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  } as const;

  return (
    <motion.div
      initial="inactive"
      animate={isActive ? "active" : "inactive"}
      whileHover="hover"
      variants={cardVariants}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white/5 border rounded-2xl p-8 max-w-[600px] backdrop-blur-md w-full cursor-pointer"
    >
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          variants={iconVariants}
          className="flex-shrink-0"
        >
          {f.icon}
        </motion.div>
        <h3 className="text-white text-[26px] font-bold max-md:text-[22px]">
          {f.title}
        </h3>
      </div>
      <p className="text-[#CCCCCC] text-[16px] leading-relaxed">
        {f.desc}
      </p>
    </motion.div>
  );
}
