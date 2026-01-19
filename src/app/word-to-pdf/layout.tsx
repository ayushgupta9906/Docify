import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Word to PDF Converter Online - Convert DOCX to PDF Free',
    description: 'Convert Microsoft Word documents to professional PDF files for free. Our online Word to PDF converter ensures high-fidelity results, preserving all fonts and layouts. Fast and secure.',
    keywords: [
        'Word to PDF converter', 'convert DOCX to PDF', 'convert Word to PDF online',
        'free Word to PDF', 'Word to PDF online free', 'best Word to PDF tool'
    ],
    openGraph: {
        title: 'Word to PDF Converter Online Free - Docify',
        description: 'Easily convert your Microsoft Word documents into professional PDF files for free. Secure, fast, and high-quality.',
        type: 'website',
        images: [{
            url: '/og-word-to-pdf.png',
            width: 1200,
            height: 630,
            alt: 'Word to PDF Converter - Docify'
        }]
    },
    alternates: {
        canonical: '/word-to-pdf'
    }
};

export default function WordToPDFLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
