"use client";

import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import { faqs } from "@/lib/faq-data";

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
