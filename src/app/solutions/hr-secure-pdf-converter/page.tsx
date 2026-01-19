import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, UserCheck, Lock, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import AuthorCard from '@/components/AuthorCard';
import { AUTHORS } from '@/lib/authors';

export const metadata: Metadata = {
    title: 'HR Secure PDF Converter - Private Employee Document Handling',
    description: 'Securely convert employee contracts, resumes, and payroll documents to PDF. HIPAA-compliant encryption and automatic file deletion for HR professionals.',
    keywords: ['HR PDF converter', 'secure employee documents', 'private payroll to PDF', 'HR document security'],
};

export default function HRSolutionPage() {
    return (
        <div className="container-main py-20">
            <div className="max-w-4xl mx-auto">
                <Breadcrumbs
                    items={[
                        { label: 'Solutions', href: '/solutions' },
                        { label: 'HR Secure PDF', href: '/solutions/hr-secure-pdf-converter' }
                    ]}
                />

                <header className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-2xl mb-6">
                        <Lock className="w-12 h-12 text-purple-600" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Secure HR Document Converter</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Privacy-first conversion for sensitive employee records, payroll data, and recruitment documents.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div className="card p-8">
                        <h2 className="text-2xl font-bold mb-4">The HR Security Standard</h2>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span><strong>GDPR & HIPAA Ready:</strong> Processing that respects strict data privacy requirements for personal information.</span>
                            </li>
                            <li className="flex gap-3">
                                <UserCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                <span><strong>Candidate Privacy:</strong> Convert resumes and portfolios without leaving a digital trail on our servers.</span>
                            </li>
                            <li className="flex gap-3">
                                <Lock className="w-5 h-5 text-purple-500 flex-shrink-0" />
                                <span><strong>Automatic Purge:</strong> Every file is permanently deleted within 30 minutes of conversion.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-[var(--primary)]/5 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
                        <h3 className="text-2xl font-bold mb-4">Convert Securely</h3>
                        <p className="mb-6 text-gray-600">Ensure your employee documents are handled with the highest security.</p>
                        <Link href="/word-to-pdf" className="btn btn-primary px-8 py-3 flex items-center gap-2">
                            Go to Word to PDF <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <section className="prose dark:prose-invert max-w-none mb-20">
                    <h2 className="text-3xl font-bold mb-6">Built for Human Resources</h2>
                    <p>
                        Handling employee records requires a unique approach to document security. Docify's HR Secure PDF Converter provides human resource professionals with a safe environment to convert offer letters, performance reviews, and sensitive payroll data into professional PDF formats.
                    </p>
                    <p>
                        Our platform uses end-to-end HTTPS encryption, ensuring that data is never intercepted during transit. We prioritize the privacy of your workforce, meaning no file is ever stored, analyzed, or shared with third parties.
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
