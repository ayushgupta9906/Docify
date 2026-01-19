import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Script from "next/script";

const interClassName = "font-sans";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://docifynow.me';

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "Docify - Free Online PDF Tools",
        template: "%s | Docify"
    },
    description: "Free online PDF tools - merge, split, compress, convert, and edit PDFs. Fast, secure, and easy to use. No signup required.",
    keywords: ["PDF tools", "merge PDF", "compress PDF", "convert PDF", "online PDF editor", "free PDF tools", "PDF converter"],
    authors: [{ name: "Docify Team" }],
    creator: "Docify",
    publisher: "Docify",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        }
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteUrl,
        siteName: 'Docify',
        title: 'Docify - Free Online PDF Tools',
        description: 'Professional PDF tools for free. Merge, split, compress, and convert PDFs online. No signup required.',
        images: [{
            url: '/og-image.png',
            width: 1200,
            height: 630,
            alt: 'Docify - Professional PDF Tools'
        }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Docify - Free Online PDF Tools',
        description: 'Professional PDF tools for free. Merge, split, compress, and convert PDFs online.',
        images: ['/twitter-image.png'],
        creator: '@docifyapp'
    },
    alternates: {
        canonical: '/'
    }
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: '#3b82f6'
};

// Structured Data Schemas
const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Docify',
    description: 'Free online PDF tools and services',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    foundingDate: '2024',
    sameAs: []
};

const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Docify',
    url: siteUrl,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
    },
    featureList: [
        'Merge PDF files',
        'Split PDF documents',
        'Compress PDF size',
        'Convert PDF to Word',
        'Convert Word to PDF',
        'Add watermarks',
        'Rotate pages',
        'Extract pages'
    ]
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <Script
                    id="organization-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(organizationSchema)
                    }}
                />
                <Script
                    id="webapp-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(webAppSchema)
                    }}
                />
                <Script
                    id="adsense-id"
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5082467413786618"
                    crossOrigin="anonymous"
                />
            </head>
            <body className={`${interClassName} antialiased`}>
                <Providers>
                    <div className="flex flex-col min-h-screen">
                        <Navigation />
                        <main className="flex-grow">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
