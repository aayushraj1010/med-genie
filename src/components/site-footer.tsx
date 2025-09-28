// components/site-footer.tsx
import { Github, Mail } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/95 px-4 py-5 mt-6 text-sm text-muted-foreground">
      <div className="container max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-primary dark:text-white">Med Genie</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="mailto:demo@gmail.com">
            <Mail className="h-4 w-4" />
          </Link>
          <Link href="/contact" className="hover:underline hover:text-primary transition-colors flex items-center gap-1">
            Contact
          </Link>
          <Link href="/about" className="hover:underline hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/contribute" className="hover:underline hover:text-primary transition-colors">
            Contribute
          </Link>
          <Link href="/privacy-policy" className="hover:underline hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/cookie-policy" className="hover:underline hover:text-primary transition-colors">
            Cookie Policy
          </Link>
          <Link href="/terms-of-use" className="hover:underline hover:text-primary transition-colors">
            Terms of Use
          </Link>
          <Link
            href="https://github.com/aayushraj1010/med-genie"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-primary transition-colors flex items-center gap-1"
          >
            <Github className="h-4 w-4" />
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
