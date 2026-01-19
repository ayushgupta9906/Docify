import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://docifynow.me';

    const services = [
        'merge', 'split', 'compress', 'pdf-to-word', 'word-to-pdf',
        'pdf-to-jpg', 'jpg-to-pdf', 'pdf-to-ppt', 'ppt-to-pdf',
        'pdf-to-excel', 'excel-to-pdf', 'image-to-pdf', 'rotate',
        'watermark', 'unlock', 'protect', 'reorder', 'delete-pages',
        'repair', 'page-numbers', 'ocr', 'pdf-to-xml', 'bulk'
    ];

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 1,
        },
        ...services.map(service => ({
            url: `${baseUrl}/${service}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        })),
        {
            url: `${baseUrl}/history`,
            lastModified: new Date(),
            changeFrequency: 'always' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/api-docs`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }
    ];
}
