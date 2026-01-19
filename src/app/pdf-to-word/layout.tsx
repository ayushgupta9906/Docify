import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'Convert PDF to Word Online - Free PDF to DOCX',
    description: 'Convert PDF files to editable Word documents for free. Accurate PDF to Word conversion with formatting preserved.',
    keywords: ['PDF to Word', 'convert PDF to DOCX', 'PDF to Word converter', 'editable Word from PDF'],
    openGraph: {
        title: 'PDF to Word Online - Free Conversion',
        description: 'Convert your PDF files to editable Word documents for free.',
        type: 'website'
    }
};

const pdfToWordSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PDF to Word Converter',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
    },
    featureList: [
        'Convert PDF to DOCX',
        'Preserve document formatting',
        'Fast and safe conversion'
    ]
};

export default function PDFToWordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Script
                id="pdf-to-word-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(pdfToWordSchema)
                }}
            />
            {children}
        </>
    );
}
