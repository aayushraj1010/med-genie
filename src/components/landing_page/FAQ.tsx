"use client";

import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqs = [
  {
    question: "What is Med Genie?",
    answer:
      "Med Genie is an AI-powered health assistant that helps you with basic medical queries, emergency guidance, and symptom-based suggestions — all through natural conversation.",
  },
  {
    question: "Is Med Genie a replacement for a doctor?",
    answer:
      "No. Med Genie is designed for basic guidance and quick information. It does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified doctor for medical concerns.",
  },
  {
    question: "Does Med Genie store my data?",
    answer:
      "No. Med Genie is privacy-first — it does not store, track, or share any personal health data.",
  },
  {
    question: "Can Med Genie help in emergencies?",
    answer:
      "Yes. Med Genie can provide you with emergency contact numbers, hospital information, and basic first-aid tips, but it cannot replace urgent medical services. Always call emergency services if needed.",
  },
  {
    question: "What features does Med Genie offer?",
    answer:
      "You can chat in multiple languages (upcoming), check symptoms, get health tips, use voice input, and toggle between dark/light themes for better accessibility.",
  },
  {
    question: "Is Med Genie free to use?",
    answer:
      "Yes! Med Genie is free for everyone. All features are available without any subscription or hidden costs.",
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faq" className="w-full h-auto bg-[#090909] py-16 px-[6%] fade-in">
      <h1 data-aos="fade-up" className="text-[32px] text-center text-[#FBFBFB] font-normal leading-[120%] mb-12">
        Frequently Asked Questions
      </h1>

      <div data-aos="fade-up" className="w-full mx-auto space-y-[24px]">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={`w-full rounded-[8px] px-6 py-4 bg-[#1a1a1a] border border-[#2C2C2C] transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[1000px]" : "max-h-[70px] overflow-hidden"
              }`}
              style={{
                transition:
                  "max-height 0.4s ease-in-out, background-color 0.3s ease",
              }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left"
              >
                <span className="text-[18px] leading-[120%] text-[#FBFBFB]">
                  {faq.question}
                </span>
                <span
                  className={`text-white transition-transform duration-300 ease-in-out ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </button>

              <div
                className={`text-[15px] leading-[150%] text-[#ADADAD] font-normal overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "opacity-100 pt-3" : "opacity-0 pt-0"
                }`}
              >
                {faq.answer}
              </div>
            </div>
          );
        })}
      </div>

      {/* Simple CSS fade-in animation for the whole section */}
      <style jsx>{`
        .fade-in {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
