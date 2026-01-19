import { Metadata } from 'next';
import HomeClient from '@/components/home/HomeClient';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'Free Online PDF Tools - Edit, Convert & Merge PDFs',
    description: 'Professional PDF tools for free. Fast, secure, and easy to use. No signup required. Merge, split, compress, and convert PDFs online.',
    keywords: ['free PDF tools', 'online PDF editor', 'merge PDF', 'compress PDF', 'convert PDF'],
    openGraph: {
        title: 'Free Online PDF Tools - Docify',
        description: 'Every tool you need to work with PDFs in one place.',
        type: 'website',
    }
};

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'Is Docify really free to use?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, all our tools are 100% free with no hidden charges or limits for standard use. You don\'t even need to create an account.'
            }
        },
        {
            '@type': 'Question',
            name: 'Is my data secure?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Absolutely. We treat security seriously. All uploaded files are processed via HTTPS and are automatically deleted from our servers after 30 minutes.'
            }
        },
        {
            '@type': 'Question',
            name: 'Do you keep a copy of my files?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. We do not store, share, or analyze any of your data. Once the processing is complete and the file is deleted, it\'s gone forever.'
            }
        },
        {
            '@type': 'Question',
            name: 'Can I use Docify on my mobile phone?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes! Docify is a progressive web app that works perfectly on smartphones, tablets, and desktops. No app installation required.'
            }
        }
    ]
};

export default function Page() {
    return (
        <>
            <Script
                id="faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqSchema)
                }}
            />
            <HomeClient />
        </>
    );
}
