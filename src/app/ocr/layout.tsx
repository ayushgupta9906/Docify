import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'OCR PDF Online - Extract Text from Scanned PDFs',
    description: 'Make scanned PDF files searchable and editable with free online OCR. Accurate text extraction from PDF documents.',
    keywords: ['OCR PDF', 'searchable PDF', 'extract text from PDF', 'online OCR', 'scanned PDF to text'],
    openGraph: {
        title: 'OCR PDF Online - Free Text Extraction',
        description: 'Extract text from scanned PDFs and images using free online OCR.',
        type: 'website'
    }
};

export default function OCRLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
