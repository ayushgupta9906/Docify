import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Image to PDF Converter Online - JPG/PNG to PDF Free',
    description: 'Convert JPG, PNG, and other images into a professional PDF document for free. Our online image to PDF converter is fast, secure, and preserves image quality. No signup required.',
    keywords: [
        'Image to PDF converter', 'JPG to PDF', 'PNG to PDF', 'convert images to PDF',
        'free Image to PDF', 'online Image to PDF free', 'batch image to PDF'
    ],
    openGraph: {
        title: 'Image to PDF Converter Online Free - Docify',
        description: 'Easily convert multiple images into a professional PDF file for free. Fast, secure, and preserves high quality.',
        type: 'website',
        images: [{
            url: '/og-image-to-pdf.png',
            width: 1200,
            height: 630,
            alt: 'Image to PDF Converter - Docify'
        }]
    },
    alternates: {
        canonical: '/image-to-pdf'
    }
};

export default function ImageToPDFLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
