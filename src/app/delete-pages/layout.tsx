import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Delete PDF Pages Online - Remove Pages from PDF',
    description: 'Remove unwanted pages from your PDF documents for free. Easily delete individual pages or ranges from any PDF online.',
    keywords: ['delete PDF pages', 'remove PDF pages', 'PDF page remover', 'online PDF delete'],
    openGraph: {
        title: 'Delete PDF Pages Online - Free Online Tool',
        description: 'Remove unwanted pages from your PDF documents easily online for free.',
        type: 'website'
    }
};

export default function DeletePagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
