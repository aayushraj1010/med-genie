"use client";


import { useState } from "react";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from '@/components/LanguageSwitcher'; // Adjust path if needed

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const links = [
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Our Process", href: "#process" },
  { name: "Find Specialist", href: "/specialist-recommendation" },
  { name: "Contact Us", href: "#contact" },
  { name: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-black/15 text-white fixed top-[30px] left-1/2 -translate-x-1/2 w-[87%] h-auto py-[10px] px-[20px] border border-[#3FB5F440] rounded-[10px] backdrop-blur-[15px] flex justify-between items-center z-[100]">
      {/* Logo */}
      <Link href="/">
        <span className="text-white text-xl font-bold tracking-wide">
          MedGenie
        </span>
      </Link>
<LanguageSwitcher />
      {/* Desktop Links */}
      <div
        className={`hidden md:flex gap-[40px] text-[18px] font-normal leading-[150%] ${montserrat.className}`}
      >
        {links.map(({ name, href }, i) => (
          <Link
            href={href}
            key={i}
            className="relative overflow-hidden h-[22px] group"
          >
            <span className="block text-[#ADADAD] transition-transform duration-300 group-hover:-translate-y-[120%]">
              {name}
            </span>
            <span className="absolute left-0 top-[22px] block text-[#3FB5F4] transition-transform duration-300 group-hover:-translate-y-[92%]">
              {name}
            </span>
          </Link>
        ))}
      </div>

      {/* Desktop Login */}
      <Link
        href="/login"
        className="hidden md:flex w-[100px] h-[40px] rounded-[7px] py-[10px] px-[29px] bg-[#3FB5F4] hover:bg-[#2196d3] hover:shadow-[0_5px_15px_0_rgba(63,181,244,0.4)] transition-all duration-200 justify-center items-center text-[18px] text-[#101010] font-medium"
      >
        Login
      </Link>

      {/* Hamburger */}
      <button
        className="md:hidden text-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu (Tailwind Animation) */}
      <div
        className={`absolute top-full left-0 w-full bg-black/90 rounded-[10px] py-4 px-6 flex flex-col gap-4 md:hidden z-[99] transition-all duration-300 ease-in-out ${
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {links.map(({ name, href }, i) => (
          <Link
            href={href}
            key={i}
            onClick={() => setMenuOpen(false)}
            className={`text-[18px] text-[#ADADAD] hover:text-[#3FB5F4] transition duration-200 ${montserrat.className}`}
          >
            {name}
          </Link>
        ))}
        <Link
          href="/login"
          onClick={() => setMenuOpen(false)}
          className="w-full h-[40px] rounded-[7px] bg-[#3FB5F4] hover:bg-[#2196d3] hover:shadow-[0_5px_15px_0_rgba(63,181,244,0.4)] transition-all duration-200 text-[18px] text-[#101010] font-medium flex items-center justify-center"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
