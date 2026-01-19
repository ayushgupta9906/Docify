import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Compress PDF Online Free - Reduce PDF File Size',
    description: 'Compress PDF files online for free. Reduce PDF file size while maintaining maximum quality. Choose between low, medium, and high compression levels. No signup required.',
    keywords: [
        'compress PDF online', 'reduce PDF size', 'shrink PDF free', 'PDF compressor',
        'minify PDF online', 'compress PDF without losing quality', 'online PDF optimizer'
    ],
    openGraph: {
        title: 'Compress PDF Online Free - Docify',
        description: 'Optimize and shrink your PDF files easily online for free. Fast, secure, and preserves quality.',
        type: 'website',
        images: [{
            url: '/og-compress.png',
            width: 1200,
            height: 630,
            alt: 'Compress PDF Online - Docify'
        }]
    },
    alternates: {
        canonical: '/compress'
    }
};

export default function CompressLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
