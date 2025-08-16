"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const brandColor = "rgb(63, 181, 244)"; // Updated MedGenie brand color

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full bg-[#090909] px-[6%] pt-[175px] flex flex-col items-center gap-[60px] max-[768px]:pt-[120px] max-[640px]:gap-[40px]">
      <div
        className={`flex flex-col items-center gap-[32px] max-[640px]:gap-[24px] w-full text-center transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h1
          className="font-medium leading-[110%] tracking-[0px] text-white
          text-[45px] max-[1024px]:text-[36px] max-[768px]:text-[30px]
          max-[480px]:text-[24px] max-[380px]:text-[22px]"
        >
          Your AI-powered Health Companion
          <br />
          <span style={{ color: brandColor }}>MedGenie</span> – Care at Your Fingertips
        </h1>

        <p
          className="text-[#939393] text-[20px] font-normal leading-[150%]
          max-[768px]:text-[16px] max-[768px]:leading-[140%]"
        >
          MedGenie is your smart AI health assistant — get instant answers to basic
          medical questions, emergency guidance, and symptom-based suggestions.
          Privacy-first, accessible anywhere, anytime.
        </p>

        <a
          href="/login"
          target="_blank"
          rel="noopener noreferrer"
          style={{ backgroundColor: brandColor }}
          className="text-black text-[21px] font-medium rounded-[7px]
            px-[28px] py-[14px] w-[250px] h-[53px] flex justify-center items-center gap-[9px]
            max-[768px]:text-[16px] max-[768px]:px-[16px] max-[768px]:py-[10px]
            max-[768px]:w-auto max-[768px]:h-auto min-w-[200px] whitespace-nowrap
            hover:scale-105 active:scale-95 transition-transform"
        >
          Try MedGenie
        </a>
      </div>

      <div
        className={`flex flex-col items-center gap-[16px] py-[20px] w-full transition-all duration-700 delay-200 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        <p className="text-[#939393] text-[18px] font-normal leading-[150%]
          max-[768px]:text-[14px] max-[768px]:leading-[130%]">
          Helping users during health emergencies, trusted by the open-source community
        </p>
      </div>
    </section>
  );
}
