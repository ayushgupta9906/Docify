import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'PDF to Word Converter Online - Convert PDF to DOCX Free',
    description: 'Convert PDF files to editable Microsoft Word documents for free. Our online PDF to Word converter preserves formatting, layouts, and tables. No registration required.',
    keywords: [
        'PDF to Word converter', 'convert PDF to Word online', 'PDF to DOCX', 'free PDF to Word',
        'convert PDF to editable Word', 'PDF to Word online free', 'best PDF to Word'
    ],
    openGraph: {
        title: 'PDF to Word Converter Online Free - Docify',
        description: 'Easily convert your PDF files into editable Microsoft Word documents for free. Accurate, fast, and secure.',
        type: 'website',
        images: [{
            url: '/og-pdf-to-word.png',
            width: 1200,
            height: 630,
            alt: 'PDF to Word Converter - Docify'
        }]
    },
    alternates: {
        canonical: '/pdf-to-word'
    }
};

export default function PDFToWordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
