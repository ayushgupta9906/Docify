import { Metadata } from 'next';
import Link from 'next/link';
import { Landmark, ArrowDownToLine, Zap, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import AuthorCard from '@/components/AuthorCard';
import { AUTHORS } from '@/lib/authors';

export const metadata: Metadata = {
    title: 'Government Portal PDF Compressor - Shrink Files for Official Uploads',
    description: 'Compress PDF files to meet strict government portal size limits (e.g., 2MB or 5MB). Maintain required resolution for official document processing.',
    keywords: ['government PDF compressor', 'official document shrink', 'portal file size limit', 'compress PDF for upload'],
};

export default function GovernmentSolutionPage() {
    return (
        <div className="container-main py-20">
            <div className="max-w-4xl mx-auto">
                <Breadcrumbs
                    items={[
                        { label: 'Solutions', href: '/solutions' },
                        { label: 'Government PDF Compressor', href: '/solutions/government-portal-pdf-compressor' }
                    ]}
                />

                <header className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-4 bg-orange-50 dark:bg-orange-900/30 rounded-2xl mb-6">
                        <ArrowDownToLine className="w-12 h-12 text-orange-600" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Government Portal PDF Compressor</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Efficiently shrink documents to meet the strict file size limits of federal, state, and local government portals.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div className="card p-8">
                        <h2 className="text-2xl font-bold mb-4">Optimized for Submission</h2>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <Landmark className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                <span><strong>Portal Compliance:</strong> Guaranteed to reduce files below the common 2MB or 5MB submission thresholds.</span>
                            </li>
                            <li className="flex gap-3">
                                <ArrowDownToLine className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                <span><strong>Smart Compression:</strong> Downsample images while keeping text perfectly sharp for OCR processing.</span>
                            </li>
                            <li className="flex gap-3">
                                <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                <span><strong>Instant Results:</strong> Compress large portfolios or ID scans in milliseconds.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-[var(--primary)]/5 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
                        <h3 className="text-2xl font-bold mb-4">Ready to Upload?</h3>
                        <p className="mb-6 text-gray-600">Shrink your documents for a successful portal submission.</p>
                        <Link href="/compress" className="btn btn-primary px-8 py-3 flex items-center gap-2">
                            Go to PDF Compressor <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <section className="prose dark:prose-invert max-w-none mb-20">
                    <h2 className="text-3xl font-bold mb-6">Overcome Submission Roadblocks</h2>
                    <p>
                        Applying for grants, filing patents, or submitting official government forms often comes with a frustrating hurdle: strict file size limits. Docify's Government Portal PDF Compressor is specifically tuned to maximize compression without triggering rejection from official OCR (Optical Character Recognition) systems.
                    </p>
                    <p>
                        Our tool offers three levels of compression, allowing you to fine-tune the balance between file size and visual fidelity. Stay compliant with official requirements while ensuring your documents are processed without delay.
                    </p>
                </section>

                <div className="mt-20 border-t pt-12">
                    <h3 className="text-xl font-bold mb-6 text-center">Verified by Experts</h3>
                    <AuthorCard author={AUTHORS['security-expert']} />
                </div>
            </div>
        </div>
    );
}
