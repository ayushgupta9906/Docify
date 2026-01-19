import { Metadata } from 'next';
import Link from 'next/link';
import { Home, Scissors, FileCode, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import AuthorCard from '@/components/AuthorCard';
import { AUTHORS } from '@/lib/authors';

export const metadata: Metadata = {
    title: 'Real Estate PDF Splitter - Separate Listing Docs & Contracts',
    description: 'Split massive real estate document packets into individual files for listing, escrow, and title. Secure, fast, and easy extraction for realtors.',
    keywords: ['real estate PDF splitter', 'realtor PDF tool', 'separate listing documents', 'split escrow files'],
};

export default function RealEstateSolutionPage() {
    return (
        <div className="container-main py-20">
            <div className="max-w-4xl mx-auto">
                <Breadcrumbs
                    items={[
                        { label: 'Solutions', href: '/solutions' },
                        { label: 'Real Estate PDF Splitter', href: '/solutions/real-estate-document-splitter' }
                    ]}
                />

                <header className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/30 rounded-2xl mb-6">
                        <Home className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Real Estate Document Splitter</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Precision splitting for high-volume real estate transaction packets and listing documents.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div className="card p-8">
                        <h2 className="text-2xl font-bold mb-4">Realtor-Specific Features</h2>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <Scissors className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <span><strong>Contract Extraction:</strong> Quickly pull the signed purchase agreement from a 50-page disclosure packet.</span>
                            </li>
                            <li className="flex gap-3">
                                <FileCode className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                <span><strong>Batch Splitting:</strong> Separate every page into a standalone document for individual uploads to CRM portals.</span>
                            </li>
                            <li className="flex gap-3">
                                <Home className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span><strong>MLS Optimized:</strong> Ensure your documents meet size and format requirements for local MLS systems.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-[var(--primary)]/5 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
                        <h3 className="text-2xl font-bold mb-4">Start Splitting</h3>
                        <p className="mb-6 text-gray-600">Separate your real estate packets into clean, manageable files.</p>
                        <Link href="/split" className="btn btn-primary px-8 py-3 flex items-center gap-2">
                            Go to PDF Splitter <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <section className="prose dark:prose-invert max-w-none mb-20">
                    <h2 className="text-3xl font-bold mb-6">Close Deals Faster</h2>
                    <p>
                        Real estate transactions are document-heavy and often involve multi-page packets that need to be parsed and distributed to various stakeholders. Docify's Real Estate PDF Splitter allows agents and transaction coordinators to take control of their files, extracting only the necessary pages for escrow, title, or the lender.
                    </p>
                    <p>
                        With our secure platform, sensitive client financial data is protected with 256-bit encryption during the split. Once you've extracted your documents, they are automatically purged from our systems, ensuring full compliance with privacy regulations.
                    </p>
                </section>

                <div className="mt-20 border-t pt-12">
                    <h3 className="text-xl font-bold mb-6 text-center">Verified by Experts</h3>
                    <AuthorCard author={AUTHORS['pdf-specialist']} />
                </div>
            </div>
        </div>
    );
}
