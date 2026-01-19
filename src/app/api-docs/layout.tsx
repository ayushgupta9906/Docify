import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Docify API Documentation - PDF Developer Tools',
    description: 'Integration guide and API documentation for Docify PDF tools. Build professional PDF workflows with our free API.',
    keywords: ['PDF API', 'developer tools', 'PDF integration', 'Docify documentation'],
    openGraph: {
        title: 'Docify API Docs - Developer Guide',
        description: 'Build professional PDF workflows using Docify free online API.',
        type: 'website'
    }
};

export default function APIDocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
