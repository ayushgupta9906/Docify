import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Repair PDF Online - Fix Corrupted PDF Files',
    description: 'Repair and recover data from corrupted or damaged PDF files for free. Online PDF repair tool for broken PDFs.',
    keywords: ['repair PDF', 'fix corrupted PDF', 'recover PDF data', 'broken PDF fixer'],
    openGraph: {
        title: 'Repair PDF Online - Free PDF Recovery',
        description: 'Repair and recover data from your corrupted or damaged PDF files online for free.',
        type: 'website'
    }
};

export default function RepairLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
