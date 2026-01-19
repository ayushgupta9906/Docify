import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Bulk PDF Conversion Online - Batch Process PDF Files',
    description: 'Batch process and convert multiple PDF files at once for free. Fast and efficient bulk PDF tool for all your needs.',
    keywords: ['bulk PDF', 'batch PDF conversion', 'process multiple PDFs', 'online bulk PDF tool'],
    openGraph: {
        title: 'Bulk PDF Conversion - Free Batch Processing',
        description: 'Batch process and convert multiple PDF files at once online for free.',
        type: 'website'
    }
};

export default function BulkLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
