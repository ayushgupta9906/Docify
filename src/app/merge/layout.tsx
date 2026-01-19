import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Merge PDF Online Free - Combine PDF Files Instantly',
    description: 'Merge multiple PDF files into one document in seconds. Use our free online PDF merger to combine, reorder, and join PDFs with 256-bit encryption. No signup required.',
    keywords: [
        'merge PDF online', 'combine PDF files', 'join PDF free', 'PDF merger free',
        'merge PDF documents', 'combine multiple PDFs', 'online PDF joiner'
    ],
    openGraph: {
        title: 'Merge PDF Online Free - Docify',
        description: 'Combine and join PDF files easily online for free. Fast, secure, and professional merging tool.',
        type: 'website',
        images: [{
            url: '/og-merge.png',
            width: 1200,
            height: 630,
            alt: 'Merge PDF Online - Docify'
        }]
    },
    alternates: {
        canonical: '/merge'
    }
};

export default function MergeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
