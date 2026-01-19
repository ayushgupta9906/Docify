import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Split PDF Online Free - Extract PDF Pages Instantly',
    description: 'Split PDF files online for free. Extract specific pages, split into fixed ranges, or separate every page into a new PDF. Fast, secure, and no signup required.',
    keywords: [
        'split PDF online', 'extract PDF pages', 'separate PDF pages', 'PDF splitter free',
        'split PDF by range', 'extract pages from PDF online', 'online PDF separator'
    ],
    openGraph: {
        title: 'Split PDF Online Free - Docify',
        description: 'Easily split and extract pages from your PDF files online for free. Flexible splitting options and secure processing.',
        type: 'website',
        images: [{
            url: '/og-split.png',
            width: 1200,
            height: 630,
            alt: 'Split PDF Online - Docify'
        }]
    },
    alternates: {
        canonical: '/split'
    }
};

export default function SplitLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
