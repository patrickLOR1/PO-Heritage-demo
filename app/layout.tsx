import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/site-config";
import CookieBanner from "@/components/marketing/CookieBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE_CONFIG.company.name} — ${SITE_CONFIG.company.tagline}`,
  description: SITE_CONFIG.company.description,
  keywords: [
    "CRM inteligente",
    "ventas con IA",
    "SDR automatizado",
    "pipeline de ventas",
    "PO Heritage",
    "Groq",
    "Llama 3",
  ],
  openGraph: {
    title: `${SITE_CONFIG.company.name} — ${SITE_CONFIG.company.tagline}`,
    description: SITE_CONFIG.company.description,
    type: "website",
    locale: "es_MX",
    url: SITE_CONFIG.company.url,
    siteName: SITE_CONFIG.company.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.company.name} — ${SITE_CONFIG.company.tagline}`,
    description: SITE_CONFIG.company.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD for AI Search Engines (Perplexity, ChatGPT Search) and Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": SITE_CONFIG.company.name,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "url": SITE_CONFIG.company.url,
    "description": SITE_CONFIG.company.description,
    "offers": {
      "@type": "Offer",
      "price": "4999.00",
      "priceCurrency": "MXN",
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_CONFIG.company.name,
      "logo": `${SITE_CONFIG.company.url}${SITE_CONFIG.company.logo}`,
    },
  };

  return (
    <html lang="es-MX" className={`${inter.variable} h-full scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-[#030712] text-white antialiased">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
