import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Convert Images to PDF Online - Free Image Converter',
    description: 'Convert multiple image formats (JPG, PNG, TIFF) to PDF for free. Professional image to PDF converter online.',
    keywords: ['Image to PDF', 'PNG to PDF', 'convert images to PDF', 'online image converter'],
    openGraph: {
        title: 'Image to PDF Online - Free Conversion',
        description: 'Convert your images (JPG, PNG, TIFF) to professional PDF documents for free.',
        type: 'website'
    }
};

export default function ImageToPDFLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
