import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Convert PowerPoint to PDF Online - Free PPTX to PDF',
    description: 'Convert Microsoft PowerPoint presentations to PDF for free. Professional PPT to PDF converter online.',
    keywords: ['PowerPoint to PDF', 'convert PPTX to PDF', 'PPT to PDF converter', 'online PPT to PDF'],
    openGraph: {
        title: 'PowerPoint to PDF Online - Free Conversion',
        description: 'Convert your PowerPoint presentations (PPTX) to professional PDF documents for free.',
        type: 'website'
    }
};

export default function PPTToPDFLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
