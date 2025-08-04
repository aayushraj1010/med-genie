import Script from 'next/script';

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Med Genie",
    "description": "Get instant AI-powered health advice and medical information. Ask questions about symptoms, treatments, and general health guidance with our intelligent medical chatbot.",
    "url": "https://med-genie-five.vercel.app",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "Med Genie Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Med Genie",
      "url": "https://med-genie-five.vercel.app"
    },
    "potentialAction": {
      "@type": "UseAction",
      "target": "https://med-genie-five.vercel.app"
    },
    "featureList": [
      "AI-powered health advice",
      "Symptom checking",
      "Medical information",
      "Health consultation",
      "24/7 availability"
    ],
    "screenshot": "https://med-genie-five.vercel.app/og-image.png",
    "softwareVersion": "1.0.0",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    }
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
} 