import { Metadata } from 'next';
import Link from 'next/link';
import { Scale, Shield, FileText, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import AuthorCard from '@/components/AuthorCard';
import { AUTHORS } from '@/lib/authors';

export const metadata: Metadata = {
    title: 'Legal PDF to Word Converter - Secure DOCX Conversion for Lawyers',
    description: 'Convert legal PDF documents to editable Word files with high-fidelity formatting. Secure, private, and lawyer-approved DOCX conversion. No data storage.',
    keywords: ['legal PDF to Word', 'lawyer PDF converter', 'court document to DOCX', 'secure legal conversion'],
};

export default function LegalSolutionPage() {
    return (
        <div className="container-main py-20">
            <div className="max-w-4xl mx-auto">
                <Breadcrumbs
                    items={[
                        { label: 'Solutions', href: '/solutions' },
                        { label: 'Legal PDF to Word', href: '/solutions/legal-pdf-to-word' }
                    ]}
                />

                <header className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl mb-6">
                        <Scale className="w-12 h-12 text-indigo-600" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Legal PDF to Word Conversion</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        High-fidelity, secure, and private document conversion designed specifically for legal professionals.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div className="card p-8">
                        <h2 className="text-2xl font-bold mb-4">Why Lawyers Choose Docify</h2>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span><strong>Privacy First:</strong> Files are never stored and are automatically wiped after processing.</span>
                            </li>
                            <li className="flex gap-3">
                                <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                <span><strong>Layout Accuracy:</strong> Preservation of complex headers, footers, and case numbering.</span>
                            </li>
                            <li className="flex gap-3">
                                <Scale className="w-5 h-5 text-purple-500 flex-shrink-0" />
                                <span><strong>Admissible Formatting:</strong> Maintain the structural integrity required for court submissions.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-[var(--primary)]/5 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
                        <h3 className="text-2xl font-bold mb-4">Ready to convert?</h3>
                        <p className="mb-6 text-gray-600">Start using our professional legal converter now.</p>
                        <Link href="/pdf-to-word" className="btn btn-primary px-8 py-3 flex items-center gap-2">
                            Go to PDF to Word <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <section className="prose dark:prose-invert max-w-none mb-20">
                    <h2 className="text-3xl font-bold mb-6">Optimized for Legal Workflows</h2>
                    <p>
                        In the legal field, accuracy isn't just a preference—it's a requirement. Docify understands the nuances of legal documents, from Bates numbering to complex table of contents. Our engine is optimized to identify and preserve these elements during the conversion from PDF to editable Word format.
                    </p>
                    <p>
                        Whether you are redlining a contract, preparing exhibits for trial, or reviewing opposing counsel's filings, Docify provides the speed and privacy you need to work efficiently without compromising client confidentiality.
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
