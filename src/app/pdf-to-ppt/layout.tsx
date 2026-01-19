import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Convert PDF to PowerPoint Online - Free PDF to PPTX',
    description: 'Convert your PDF files to editable PowerPoint presentations for free. Fast and accurate PDF to PPT conversion.',
    keywords: ['PDF to PowerPoint', 'convert PDF to PPTX', 'PDF to PPT converter', 'online PDF to PPT'],
    openGraph: {
        title: 'PDF to PowerPoint Online - Free Conversion',
        description: 'Convert your PDF files to editable PowerPoint presentations for free.',
        type: 'website'
    }
};

export default function PDFToPPTLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
