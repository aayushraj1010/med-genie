import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/hooks/use-theme';
import { AuthProvider } from '@/contexts/AuthContext';
import { Analytics } from '@vercel/analytics/react';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import { AOSProvider } from '@/components/aos-provider';
import './globals.css';
import { StructuredData } from './structured-data';
import ErrorBoundary from '@/components/ErrorBoundary';
import Preloader from "../components/Preloader";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: {
    default: 'Med Genie - Your AI Health Assistant',
    template: '%s | Med Genie',
  },
  description:
    'Get instant AI-powered health advice and medical information. Ask questions about symptoms, treatments, and general health guidance with our intelligent medical chatbot.',
  keywords: [
    'AI health assistant',
    'medical chatbot',
    'health advice',
    'symptoms checker',
    'medical information',
    'healthcare AI',
    'virtual health assistant',
    'medical consultation',
    'health questions',
    'AI doctor',
  ],
  authors: [{ name: 'Med Genie Team' }],
  creator: 'Med Genie',
  publisher: 'Med Genie',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://med-genie-five.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://med-genie-five.vercel.app',
    title: 'Med Genie - Your AI Health Assistant',
    description:
      'Get instant AI-powered health advice and medical information. Ask questions about symptoms, treatments, and general health guidance.',
    siteName: 'Med Genie',
    images: [
      {
        url: 'https://med-genie-five.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Med Genie - AI Health Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Med Genie - Your AI Health Assistant',
    description:
      'Get instant AI-powered health advice and medical information. Ask questions about symptoms, treatments, and general health guidance.',
    images: ['https://med-genie-five.vercel.app/og-image.png'],
    creator: '@medgenie',
    site: '@medgenie',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual verification code
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'health',
  classification: 'healthcare',
  other: {
    'msapplication-TileColor': '#ffffff',
    'theme-color': '#ffffff',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Med Genie',
    'application-name': 'Med Genie',
    'msapplication-TileImage': '/favicon.ico',
    'msapplication-config': '/browserconfig.xml',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Extension conflict protection
              window.addEventListener('error', function(e) {
                if (e.message.includes('Cannot read properties of null') && 
                    e.filename && e.filename.includes('chrome-extension')) {
                  console.warn('Browser extension conflict detected:', e.message);
                  e.preventDefault();
                  return false;
                }
              });
              
              // Prevent extension scripts from breaking the page
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && e.reason.message && 
                    e.reason.message.includes('Cannot read properties of null')) {
                  console.warn('Extension promise rejection caught:', e.reason.message);
                  e.preventDefault();
                  return false;
                }
              });
            `
          }}
        />
        {/* Security Meta Tags */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="robots" content="index, follow" />

        {/* CSP Meta Tag (fallback) */}
        <meta httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <Preloader />
        <ThemeProvider defaultTheme="dark" storageKey="med-genie-theme">
          <AuthProvider>
            <AOSProvider>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
              <Toaster />
            </AOSProvider>
          </AuthProvider>
        </ThemeProvider>
        <BackToTopButton />
      </body>
    </html>
  );
}


import BackToTopButton from '@/components/BackToTopButton';


