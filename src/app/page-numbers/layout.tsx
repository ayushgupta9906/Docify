import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Add Page Numbers to PDF Online - Free PDF Numbering',
    description: 'Add page numbers to your PDF documents easily for free. Choose position, format, and typography for PDF page numbering.',
    keywords: ['add page numbers to PDF', 'PDF numbering', 'enumerate PDF pages', 'online PDF page numbers'],
    openGraph: {
        title: 'Add Page Numbers to PDF Online - Free Online Tool',
        description: 'Add page numbers to your PDF documents easily and professionally online for free.',
        type: 'website'
    }
};

export default function PageNumbersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
