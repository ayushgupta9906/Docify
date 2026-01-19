import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reorder PDF Pages Online - Rearrange PDF Files',
    description: 'Change the order of pages in your PDF file for free. Drag and drop PDF pages to rearrange them easily online.',
    keywords: ['reorder PDF', 'rearrange PDF pages', 'organize PDF pages', 'move PDF pages'],
    openGraph: {
        title: 'Reorder PDF Pages Online - Free Online Tool',
        description: 'Rearrange and reorder pages in your PDF files easily online for free.',
        type: 'website'
    }
};

export default function ReorderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
