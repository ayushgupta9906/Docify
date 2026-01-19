import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Convert PDF to Excel Online - Free PDF to XLSX',
    description: 'Convert PDF tables to editable Excel spreadsheets for free. Accurate PDF to Excel conversion online.',
    keywords: ['PDF to Excel', 'convert PDF to XLSX', 'PDF to Excel converter', 'online PDF to Excel'],
    openGraph: {
        title: 'PDF to Excel Online - Free Conversion',
        description: 'Convert your PDF tables to editable Microsoft Excel spreadsheets for free.',
        type: 'website'
    }
};

export default function PDFToExcelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
