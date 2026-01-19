import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Convert PDF to XML Online - Free Data Extraction',
    description: 'Convert your PDF files to XML format for free. Extract data and content from PDFs into structured XML.',
    keywords: ['PDF to XML', 'convert PDF to XML', 'PDF data extraction', 'XML from PDF'],
    openGraph: {
        title: 'PDF to XML Online - Free Conversion',
        description: 'Convert your PDF files to structured XML format online for free.',
        type: 'website'
    }
};

export default function PDFToXMLLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
