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
                    <Link href="mailto:demo@gmail.com" >
                        <Mail className="h-4 w-4" /></Link>
                    <Link href="/contact" className="hover:underline flex items-center gap-1">
                        Contact
                    </Link>
                    <Link href="/about" className="hover:underline">
                        About
                    </Link>
                    <Link href="/contribute" className="hover:underline">
                        Contribute
                    </Link>
                    <Link href="/Privacy Policy" className="hover:underline">
                        Privacy Policy
                    </Link>
                    <Link
                        href="https://github.com/aayushraj1010/med-genie"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1"
                    >
                        <Github className="h-4 w-4" />
                        GitHub
                    </Link>
                </div>
            </div>
        </footer>
    );
}
