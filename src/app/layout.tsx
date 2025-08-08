import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aditi Consulting AI - Intelligent Document Analysis",
  description: "Advanced AI-powered document analysis and chat platform. Upload PDFs and get intelligent insights using cutting-edge AI technology from Aditi Consulting.",
  keywords: ["Aditi Consulting", "AI", "Document Analysis", "PDF Chat", "OpenAI", "Artificial Intelligence", "Business Intelligence", "Document Processing"],
  authors: [{ name: "Aditi Consulting" }],
  creator: "Aditi Consulting",
  publisher: "Aditi Consulting",
  
  // Open Graph metadata for social sharing (Facebook, LinkedIn, WhatsApp, Teams)
  openGraph: {
    title: "Aditi Consulting AI - Intelligent Document Analysis",
    description: "Advanced AI-powered document analysis and chat platform. Upload PDFs and get intelligent insights using cutting-edge AI technology.",
    url: "https://aditi-consulting-ai.vercel.app",
    siteName: "Aditi Consulting AI",
    images: [
      {
        url: "https://aditi-consulting-ai.vercel.app/aditi-logo-2.0.png",
        width: 1200,
        height: 630,
        alt: "Aditi Consulting AI - Intelligent Document Analysis",
        type: "image/png",
      },
      {
        url: "https://aditi-consulting-ai.vercel.app/aditi-logo-2.0.png",
        width: 800,
        height: 600,
        alt: "Aditi Consulting AI Logo",
        type: "image/png",
      },
      {
        url: "https://aditi-consulting-ai.vercel.app/aditi-logo-2.0.png",
        width: 400,
        height: 400,
        alt: "Aditi Consulting AI",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    site: "@AditiConsulting",
    creator: "@AditiConsulting",
    title: "Aditi Consulting AI - Intelligent Document Analysis",
    description: "Advanced AI-powered document analysis and chat platform. Upload PDFs and get intelligent insights using cutting-edge AI technology.",
    images: {
      url: "https://aditi-consulting-ai.vercel.app/aditi-logo-2.0.png",
      alt: "Aditi Consulting AI - Intelligent Document Analysis",
    },
  },
  
  // Favicon and icons
  icons: {
    icon: [
      { url: "/aditi-logo-2.0.png", sizes: "32x32", type: "image/png" },
      { url: "/aditi-logo-2.0.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/aditi-logo-2.0.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/aditi-logo-2.0.png",
  },
  
  // Additional metadata
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
  
  // Verification (add your verification codes if needed)
  verification: {
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/aditi-logo-2.0.png" type="image/png" />
        <link rel="apple-touch-icon" href="/aditi-logo-2.0.png" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Aditi Consulting AI" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Aditi Consulting AI" />
        
        {/* Additional Social Media Meta Tags for WhatsApp, Instagram, Facebook, Twitter, Teams, LinkedIn */}
        <meta property="og:image:secure_url" content="https://aditi-consulting-ai.vercel.app/aditi-logo-2.0.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        
        {/* LinkedIn/Teams specific */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aditi-consulting-ai.vercel.app" />
        
        {/* Twitter additional */}
        <meta name="twitter:domain" content="aditi-consulting-ai.vercel.app" />
        <meta name="twitter:url" content="https://aditi-consulting-ai.vercel.app" />
        
        {/* General SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href="https://aditi-consulting-ai.vercel.app" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
