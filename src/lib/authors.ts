export interface Author {
    id: string;
    name: string;
    role: string;
    bio: string;
    expertise: string[];
    image: string;
}

export const AUTHORS: Record<string, Author> = {
    'security-expert': {
        id: 'security-expert',
        name: 'David Chen',
        role: 'Chief Security Architect',
        bio: 'David has over 15 years of experience in cloud infrastructure and data encryption. He ensures that every file processed by Docify is handled with enterprise-grade security protocols.',
        expertise: ['AES-256 Encryption', 'Cloud Security', 'Data Privacy Laws'],
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'
    },
    'pdf-specialist': {
        id: 'pdf-specialist',
        name: 'Sarah Miller',
        role: 'Senior Document Engineer',
        bio: 'Sarah is a specialist in document parsing and conversion. She optimized the high-fidelity rendering engine that powers our Word and Image to PDF converters.',
        expertise: ['PDF Standards', 'Document Layout AI', 'OCR Optimization'],
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200'
    }
};
