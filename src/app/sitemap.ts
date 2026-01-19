import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://docifynow.me';

    const services = TOOLS.map(tool => tool.href.replace('/', ''));

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
