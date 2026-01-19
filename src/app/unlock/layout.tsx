import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Unlock PDF Online - Remove Password from PDF',
    description: 'Remove password and restrictions from protected PDF files for free. Fast and secure PDF password remover.',
    keywords: ['unlock PDF', 'remove PDF password', 'decrypt PDF', 'PDF password remover'],
    openGraph: {
        title: 'Unlock PDF Online - Free Password Removal',
        description: 'Remove restrictions and passwords from your PDF files online for free.',
        type: 'website'
    }
};

export default function UnlockLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
