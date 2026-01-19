import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Rotate PDF Online - Rotate PDF Pages Permanently',
    description: 'Rotate PDF pages permanently for free. Easily rotate individual pages or the entire PDF document online.',
    keywords: ['rotate PDF', 'rotate PDF pages', 'PDF rotator', 'permanently rotate PDF'],
    openGraph: {
        title: 'Rotate PDF Online - Free Online Tool',
        description: 'Rotate your PDF pages permanently online for free.',
        type: 'website'
    }
};

export default function RotateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
