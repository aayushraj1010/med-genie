'use client';
import Link from "next/link";
import { LogoIcon } from "@/components/icons/logo-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from '@/components/ui/button';
import { UserPlus, LogIn } from "lucide-react";

export function SiteHeader() {
  const { isAuthenticated, isLoading } = useAuth();

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
            <Link href="/health-vault" className="hover:underline">Health Vault</Link>
            <Link href="/specialist-recommendation" className="hover:underline">Specialist Finder</Link>
          </nav>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Theme Toggle and Authentication */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <UserMenu />
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
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="p-2 hover:text-primary transition-colors"
                    title="Login"
                  >
                    <LogIn className="h-5 w-5" />
                  </Link>
                  <Link 
                    href="/sign-up" 
                    className="p-2 hover:text-primary transition-colors"
                    title="Register"
                  >
                    <UserPlus className="h-5 w-5" />
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
