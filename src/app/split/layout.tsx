import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'Split PDF Online - Extract Pages from PDF',
    description: 'Split a PDF file into multiple documents or extract specific pages for free. Simple, fast, and secure online PDF splitter.',
    keywords: ['split PDF', 'extract PDF pages', 'PDF splitter', 'separate PDF pages', 'cut PDF'],
    openGraph: {
        title: 'Split PDF Online - Free PDF Splitter',
        description: 'Split PDF documents or extract specific pages online for free.',
        type: 'website'
    },
    alternates: {
        canonical: '/split'
    }
};

const splitSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Split PDF Online',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
    },
    featureList: [
        'Extract specific PDF pages',
        'Split PDF into multiple files',
        'Visual page selection'
    ]
};

export default function SplitLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Script
                id="split-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(splitSchema)
                }}
            />
            {children}
        </>
    );
}
