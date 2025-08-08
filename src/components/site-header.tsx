'use client';
import Link from "next/link";
import { LogoIcon } from "@/components/icons/logo-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Combine logo/title with nav links for tight grouping */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <LogoIcon className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block text-lg">Med Genie</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-4">
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            <Link href="/register" className="hover:underline">Register</Link>
            <Link href="/health-vault" className="hover:underline">Health Vault</Link>
          </nav>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Theme Toggle and Reset Button */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="outline"
            className="text-sm"
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
          >
            Reset Chat
          </Button>
        </div>
      </div>
    </header>
  );
}
