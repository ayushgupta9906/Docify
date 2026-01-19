import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Add Watermark to PDF Online - Free PDF Watermarking',
    description: 'Add text or image watermarks to your PDF files for free. Protect your PDFs with professional online watermarking.',
    keywords: ['watermark PDF', 'add watermark to PDF', 'PDF watermarking', 'online PDF watermark'],
    openGraph: {
        title: 'Watermark PDF Online - Free Online Tool',
        description: 'Add text or image watermarks to your PDF documents online for free.',
        type: 'website'
    }
};

export default function WatermarkLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
