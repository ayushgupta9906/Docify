import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Convert PDF to JPG Online - Extract Images from PDF',
    description: 'Convert PDF pages to JPG images for free. Fast and easy PDF to JPG extraction in high quality.',
    keywords: ['PDF to JPG', 'convert PDF to image', 'PDF to JPG converter', 'extract images from PDF'],
    openGraph: {
        title: 'PDF to JPG Online - Free Conversion',
        description: 'Convert your PDF pages to high-quality JPG images for free.',
        type: 'website'
    }
};

export default function PDFToJPGLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
