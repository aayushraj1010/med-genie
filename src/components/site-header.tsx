'use client';

import { LogoIcon } from '@/components/icons/logo-icon';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center max-w-screen-2xl h-16 px-4 sm:px-6">
        {/* Logo and brand */}
        <Link href="/" className="flex items-center space-x-2">
          <LogoIcon className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Med Genie</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex flex-1 items-center justify-center space-x-6">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/contribute" className="hover:underline">
            Contribute
          </Link>
        </nav>

        {/* Right side: Theme toggle and hamburger */}
        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          {/* Hamburger button for mobile */}
          <button
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Toggle menu"
            onClick={toggleMenu}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="sm:hidden bg-background border-t border-border/40">
          <div className="flex flex-col p-4 space-y-2">
            <Link
              href="/about"
              className="block px-2 py-2 rounded hover:bg-muted"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-2 py-2 rounded hover:bg-muted"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/contribute"
              className="block px-2 py-2 rounded hover:bg-muted"
              onClick={() => setMenuOpen(false)}
            >
              Contribute
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
