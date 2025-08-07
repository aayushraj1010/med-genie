// components/site-footer.tsx
import Link from "next/link";
import { Github, Mail, MessageSquareMore, GitPullRequest } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-white text-black dark:bg-[hsl(0_0%_13%)] dark:text-white px-6 py-10">
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row sm:justify-between gap-10">
        
        {/* Left section: Logo + Text */}
        <div className="flex flex-col items-start gap-3 pl-2 sm:pl-6">
          <img
            src="/images/med-genie-avatar.svg"
            alt="Med Genie Logo"
            className="w-12 h-12"
          />
          <p className="text-sm">
            <span className="font-semibold text-lg">Med Genie</span>
            <br />
            Empowering healthcare © {new Date().getFullYear()}
          </p>
        </div>

        {/* Right section: Social Links */}
        <div>
          <h6 className="text-sm font-bold mb-4 uppercase tracking-wide">Social</h6>
          <div className="flex items-center gap-6 flex-wrap">
            <Link href="mailto:demo@gmail.com" aria-label="Email">
              <Mail className="h-5 w-5 hover:text-gray-600 dark:hover:text-gray-300" />
            </Link>
            <Link
              href="https://github.com/aayushraj1010/med-genie"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5 hover:text-gray-600 dark:hover:text-gray-300" />
            </Link>
            <Link href="/contact" aria-label="Contact">
              <MessageSquareMore className="h-5 w-5 hover:text-gray-600 dark:hover:text-gray-300" />
            </Link>
            <Link href="/contribute" aria-label="Contribute">
              <GitPullRequest className="h-5 w-5 hover:text-gray-600 dark:hover:text-gray-300" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
