"use client";

import { FaDiscord, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#3FB5F4]/90 to-[#3FB5F4]/80 backdrop-blur-md text-white font-sans px-6 py-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Left - Logo + Tagline + Socials */}
        <div className="col-span-1">
          <h2 data-aos="fade-up" className="text-2xl font-bold mb-2">MedGenie</h2>
          <p data-aos="fade-up" className="text-sm mb-4 opacity-90">
            The Future of Healthcare Collaboration
          </p>
          <div data-aos="fade-up" className="flex space-x-4 text-lg">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition-transform transform hover:scale-110"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition-transform transform hover:scale-110"
            >
              <FaInstagram />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition-transform transform hover:scale-110"
            >
              <FaDiscord />
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-2">
          <h3 data-aos="fade-up" className="font-semibold text-sm">Quick Links</h3>
          <ul data-aos="fade-up" className="text-sm space-y-1 text-white/80">
            <li><a href="/" className="hover:text-white hover:underline">Home</a></li>
            <li><a href="/#how-it-works" className="hover:text-white hover:underline">How it Works</a></li>
            <li><a href="/#faqs" className="hover:text-white hover:underline">FAQs</a></li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 data-aos="fade-up" className="font-semibold text-sm">Community & Support</h3>
          <ul data-aos="fade-up" className="text-sm space-y-1 text-white/80">
            <li><a href="https://discord.gg/medgenie" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">Join our Discord</a></li>
            <li><a href="https://twitter.com/medgenie" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">Follow us on X</a></li>
            <li><a href="https://t.me/medgenie" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">Join our Telegram</a></li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 data-aos="fade-up" className="font-semibold text-sm">Legal & Policy</h3>
          <ul data-aos="fade-up" className="text-sm space-y-1 text-white/80">
            <li><a href="/privacypolicy.html" className="hover:text-white hover:underline">Privacy Policy</a></li>
            <li><a href="/terms.html" className="hover:text-white hover:underline">Terms of Use</a></li>
            <li><a href="/cookies.html" className="hover:text-white hover:underline">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-white/20 mt-10 pt-4 text-xs text-white/70 text-center">
        © 2025 MedGenie. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
