import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Convert Excel to PDF Online - Free XLSX to PDF',
    description: 'Convert Microsoft Excel spreadsheets to PDF for free. Professional Excel to PDF converter online.',
    keywords: ['Excel to PDF', 'convert XLSX to PDF', 'Excel to PDF converter', 'online Excel to PDF'],
    openGraph: {
        title: 'Excel to PDF Online - Free Conversion',
        description: 'Convert your Microsoft Excel spreadsheets (XLSX) to professional PDF documents for free.',
        type: 'website'
    }
};

export default function ExcelToPDFLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
