import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'Convert Word to PDF Online - Free DOCX to PDF',
    description: 'Convert Microsoft Word documents to PDF for free. Professional DOCX to PDF converter that works on any device.',
    keywords: ['Word to PDF', 'convert DOCX to PDF', 'Word to PDF converter', 'online DOCX to PDF'],
    openGraph: {
        title: 'Word to PDF Online - Free Conversion',
        description: 'Convert your Word documents (DOCX) to PDF for free.',
        type: 'website'
    }
};

const wordToPdfSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Word to PDF Converter',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
    },
    featureList: [
        'Convert DOCX to PDF',
        'High quality PDF output',
        'Works on all browsers'
    ]
};

export default function WordToPDFLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Script
                id="word-to-pdf-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(wordToPdfSchema)
                }}
            />
            {children}
        </>
    );
}
