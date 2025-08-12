"use client";

import { CheckCircle } from "lucide-react";

const steps = [
  {
    title: "Chat Naturally with AI",
    description:
      "Ask MedGenie your health-related queries in a conversational way. Get instant guidance without jargon.",
  },
  {
    title: "Emergency Assistance",
    description:
      "Quickly access hospital info and emergency numbers when you need them the most.",
  },
  {
    title: "Symptom Checker",
    description:
      "Describe your symptoms and get AI-suggested possible conditions instantly.",
  },
  {
    title: "Voice Input",
    description:
      "Prefer talking instead of typing? Use the built-in speech recognition for hands-free interaction.",
  },
  {
    title: "Dark/Light Mode",
    description:
      "Switch between light and dark themes for better comfort, day or night.",
  },
  {
    title: "Privacy First",
    description:
      "We don’t store your data. Your conversations stay private between you and MedGenie.",
  },
  {
    title: "Upcoming: AI Diagnosis Engine",
    description:
      "Soon, MedGenie will predict health issues using advanced AI-driven analysis.",
  },
  {
    title: "Upcoming: Location-based Assistance",
    description:
      "Find nearby hospitals, clinics, and pharmacies with smart location integration.",
  },
];

const PresenceBoostGuide = () => {
  return (
    <div className="relative z-10 w-full px-6 py-16 bg-black/10 border border-[#3FB5F440] rounded-2xl backdrop-blur-md">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-white">
          Your Guide to MedGenie
        </h2>
        <p className="text-white/80 text-lg">
          Discover how MedGenie can assist you with health queries, emergencies,
          and upcoming smart features.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`bg-white/5 rounded-2xl p-6 shadow-lg backdrop-blur-lg border border-white/10 hover:shadow-xl hover:border-[#3FB5F4] transition duration-300 animate-fadeInUp`}
            style={{
              animationDelay: `${index * 0.15}s`,
              animationFillMode: "both",
            }}
          >
            <div className="flex items-start gap-4">
              <CheckCircle className="text-[#3FB5F4] w-6 h-6 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-1 text-white">
                  {step.title}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PresenceBoostGuide;
