import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Convert JPG to PDF Online - Create PDF from Images',
    description: 'Convert JPG, PNG, and other images to PDF for free. Easy to use online image to PDF converter.',
    keywords: ['JPG to PDF', 'convert image to PDF', 'image to PDF converter', 'create PDF from JPG'],
    openGraph: {
        title: 'JPG to PDF Online - Free Conversion',
        description: 'Convert your JPG images to professional PDF documents for free.',
        type: 'website'
    }
};

export default function JPGToPDFLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
