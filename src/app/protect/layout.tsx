import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Protect PDF Online - Add Password to PDF',
    description: 'Secure your PDF files with a password for free. Strong encryption to protect sensitive PDF documents online.',
    keywords: ['protect PDF', 'password protect PDF', 'secure PDF', 'encrypt PDF', 'PDF security'],
    openGraph: {
        title: 'Protect PDF Online - Free Encryption',
        description: 'Add password protection and secure your PDF files online for free.',
        type: 'website'
    }
};

export default function ProtectLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
