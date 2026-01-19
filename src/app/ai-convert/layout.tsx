import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'Smart AI Convert - AI Powered Document Conversion',
    description: 'Convert any file to any format using advanced AI. Smart conversion for PDFs, images, Word, JSON, and more with structural fidelity.',
    keywords: ['AI document conversion', 'smart convert', 'PDF to JSON AI', 'scanned PDF to text AI', 'intelligent file converter'],
    openGraph: {
        title: 'Smart AI Convert - Docify',
        description: 'Intelligent AI-powered document conversion tool.',
        type: 'website'
    },
    alternates: {
        canonical: '/ai-convert'
    }
};

const smartConvertSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Smart AI Convert',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
    },
    featureList: [
        'AI-powered document analysis',
        'Convert between any format',
        'Preserve structural fidelity',
        'OCR for scanned documents'
    ]
};

export default function SmartConvertLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Script
                id="smart-convert-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(smartConvertSchema)
                }}
            />
            {children}
        </>
    );
}
