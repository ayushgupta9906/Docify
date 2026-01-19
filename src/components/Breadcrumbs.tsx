import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
    items: {
        label: string;
        href: string;
    }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: process.env.NEXT_PUBLIC_SITE_URL || 'https://docifynow.me'
            },
            ...items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 2,
                name: item.label,
                item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://docifynow.me'}${item.href}`
            }))
        ]
    };

    return (
        <nav className="flex mb-8 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar" aria-label="Breadcrumb">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <li>
                    <Link href="/" className="hover:text-[var(--primary)] transition-colors flex items-center">
                        <Home className="w-4 h-4 mr-1" />
                        <span>Home</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={item.href} className="flex items-center">
                        <ChevronRight className="w-4 h-4 mx-1 flex-shrink-0" />
                        {index === items.length - 1 ? (
                            <span className="font-medium text-gray-900 dark:text-gray-200">{item.label}</span>
                        ) : (
                            <Link href={item.href} className="hover:text-[var(--primary)] transition-colors">
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
