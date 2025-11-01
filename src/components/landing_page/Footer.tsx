"use client";

import { FaDiscord, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { NewsletterSubscribe } from "@/components/newsletter-subscribe";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-400 text-white font-sans border-t border-white/20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-14">
        {/* Newsletter Section - Added at the top */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold mb-3 text-white">
                Stay Updated with Health Insights
              </h3>
              <p className="text-white/80 max-w-md text-lg">
                Subscribe to our newsletter for the latest health tips, AI advancements, 
                and Med Genie updates.
              </p>
            </div>
            <div className="min-w-[400px]">
              <NewsletterSubscribe />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 place-items-start md:place-items-center">
          {/* Logo + Tagline + Socials */}
          <div>
            <div>
              <h2 className="text-3xl font-extrabold mb-3 tracking-tight">
                MedGenie
              </h2>
              <p className="text-sm text-white/80 leading-relaxed mb-6">
                The Future of Healthcare Collaboration
              </p>
              <div className="flex items-center space-x-5 text-xl">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/90 transition-all hover:scale-110"
                >
                  <FaXTwitter />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/90 transition-all hover:scale-110"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/90 transition-all hover:scale-110"
                >
                  <FaDiscord />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white/90">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/#how-it-works"
                  className="hover:text-white transition-colors"
                >
                  How it Works
                </a>
              </li>
              <li>
                <a href="/#faqs" className="hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Community & Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white/90">
              Community & Support
            </h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <a
                  href="https://discord.gg/medgenie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Join our Discord
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/medgenie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Follow us on X
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/medgenie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Join our Telegram
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Policy */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white/90">
              Legal & Policy
            </h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <a
                  href="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms.html"
                  className="hover:text-white transition-colors"
                >
                  Terms of Use
                </a>
              </li>
              <li>
                <a
                  href="/cookies.html"
                  className="hover:text-white transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-12 border-t border-white/25 pt-5 text-xs text-white/70 text-center">
          © 2025 MedGenie. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;