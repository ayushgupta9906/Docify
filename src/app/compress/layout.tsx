import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'Compress PDF Online - Reduce PDF File Size',
    description: 'Compress PDF files online for free. Reduce PDF file size while maintaining quality. Fast, secure, and easy to use. No signup required.',
    keywords: ['compress PDF', 'reduce PDF size', 'PDF compressor', 'shrink PDF', 'make PDF smaller'],
    openGraph: {
        title: 'Compress PDF Online - Free PDF Compressor',
        description: 'Reduce PDF file size online while maintaining quality.',
        type: 'website'
    },
    alternates: {
        canonical: '/compress'
    }
};

const compressSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Compress PDF Online',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
    },
    featureList: [
        'Reduce PDF file size',
        'Maintain high quality',
        'Multiple compression levels'
    ]
};

export default function CompressLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Script
                id="compress-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(compressSchema)
                }}
            />
            {children}
        </>
    );
}
