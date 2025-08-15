"use client";

import {
  Sparkles,
  ShieldCheck,
  Stethoscope,
  Mic,
  MoonStar,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

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
    title: "Specialist Recommendation",
    desc: "Get AI-powered recommendations for medical specialists based on your symptoms, age, gender, and medical history.",
    icon: <UserCheck size={40} className="text-[rgb(63,181,244)]" />,
  },
  {
    id: 5,
    title: "Voice Input",
    desc: "Speak directly to Med Genie using built-in speech recognition for quick, hands-free health assistance.",
    icon: <Mic size={40} className="text-[rgb(63,181,244)]" />,
  },
  {
    id: 6,
    title: "Theme Toggle",
    desc: "Switch between dark and light modes for a comfortable experience in any environment.",
    icon: <MoonStar size={40} className="text-[rgb(63,181,244)]" />,
  },
  {
    id: 7,
    title: "Privacy-First",
    desc: "No data storage or tracking — your health queries remain private and secure.",
    icon: <ShieldCheck size={40} className="text-[rgb(63,181,244)]" />,
  },
];

export default function FeatureSection() {
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);

  useEffect(() => {
    // Animate each feature with delay
    features.forEach((_, i) => {
      setTimeout(() => {
        setVisibleIndexes((prev) => [...prev, i]);
      }, i * 200); // delay for stagger effect
    });
  }, []);

  return (
    <section className="w-full bg-gradient-to-br px-[6%] py-[100px] flex flex-col items-center gap-[100px] max-md:gap-[60px] max-md:py-[60px]">
      {/* Animated Heading */}
      <h2
        className={`text-white text-[42px] font-extrabold text-center max-md:text-[28px] transition-all duration-700 ease-out transform ${
          visibleIndexes.includes(-1)
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        How Med Genie Helps You
      </h2>

      <div className="w-full flex flex-col gap-[80px]">
        {features.map((f, index) => (
          <div
            key={f.id}
            className={`flex items-center justify-between w-full gap-[60px] max-lg:flex-col transition-all duration-700 ease-out transform ${
              visibleIndexes.includes(index)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            } ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
          >
            {/* Step Indicator */}
            <div className="flex flex-col items-center gap-4 min-w-[60px]">
              <div
                className="text-black text-[20px] font-bold w-[45px] h-[45px] rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/10"
                style={{ backgroundColor: themeColor }}
              >
                {f.id}
              </div>
              {index !== features.length - 1 && (
                <div
                  className="w-[2px] h-[100px] max-lg:hidden"
                  style={{ backgroundColor: themeColor }}
                ></div>
              )}
            </div>

            {/* Glass Card */}
            <div
              className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-[600px] backdrop-blur-md transition-all duration-300 hover:scale-[1.02]"
              style={{
                boxShadow: `0 0 30px rgba(63, 181, 244, 0.15)`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = `0 0 40px ${themeColor}`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = `0 0 30px rgba(63, 181, 244, 0.15)`)
              }
            >
              <div className="flex items-center gap-4 mb-4">
                {f.icon}
                <h3 className="text-white text-[26px] font-bold max-md:text-[22px]">
                  {f.title}
                </h3>
              </div>
              <p className="text-[#CCCCCC] text-[16px] leading-relaxed">
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
