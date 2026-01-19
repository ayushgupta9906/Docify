import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'Merge PDF Online - Combine Multiple PDFs into One',
    description: 'Merge and combine multiple PDF files into one single document for free. Fast, secure, and easy to use. No signup required.',
    keywords: ['merge PDF', 'combine PDF', 'join PDF', 'PDF merger', 'online PDF joiner'],
    openGraph: {
        title: 'Merge PDF Online - Free PDF Merger',
        description: 'Combine multiple PDF files into one single document for free.',
        type: 'website'
    },
    alternates: {
        canonical: '/merge'
    }
};

const mergeSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Merge PDF Online',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
    },
    featureList: [
        'Merge multiple PDF files',
        'Reorder pages before merging',
        'Secure file processing'
    ]
};

export default function MergeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Script
                id="merge-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(mergeSchema)
                }}
            />
            {children}
        </>
    );
}
