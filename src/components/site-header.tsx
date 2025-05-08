import Link from 'next/link';
import { LogoIcon } from '@/components/icons/logo-icon';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <LogoIcon className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-lg">
            Med Genie
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Additional nav items can go here */}
        </div>
      </div>
    </header>
  );
}
