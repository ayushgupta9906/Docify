import { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, BookOpen, Clock, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import AuthorCard from '@/components/AuthorCard';
import { AUTHORS } from '@/lib/authors';

export const metadata: Metadata = {
    title: 'Academic PDF Merger - Combine Research Papers & Essays Free',
    description: 'Merge research papers, essays, and study notes into a single PDF for free. Optimized for students and researchers. Keep your bibliography and formatting intact.',
    keywords: ['academic PDF merger', 'student PDF tool', 'combine research papers', 'merge essays online'],
};

export default function AcademicSolutionPage() {
    return (
        <div className="container-main py-20">
            <div className="max-w-4xl mx-auto">
                <Breadcrumbs
                    items={[
                        { label: 'Solutions', href: '/solutions' },
                        { label: 'Academic PDF Merger', href: '/solutions/academic-pdf-merger' }
                    ]}
                />

                <header className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl mb-6">
                        <GraduationCap className="w-12 h-12 text-blue-600" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Academic PDF Merger</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        The ultimate tool for students and researchers to organize their work into cohesive documents.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div className="card p-8">
                        <h2 className="text-2xl font-bold mb-4">Optimized for Education</h2>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <BookOpen className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                <span><strong>Research Organization:</strong> Combine dozens of source papers into a single reference volume.</span>
                            </li>
                            <li className="flex gap-3">
                                <Clock className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                <span><strong>Save Time:</strong> Don't manually copy-paste. Merge entire chapters or essay drafts in seconds.</span>
                            </li>
                            <li className="flex gap-3">
                                <GraduationCap className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                <span><strong>Portfolio Ready:</strong> Join your best work into a professional academic portfolio.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-[var(--primary)]/5 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
                        <h3 className="text-2xl font-bold mb-4">Start Organizing</h3>
                        <p className="mb-6 text-gray-600">Join your papers into one professional document today.</p>
                        <Link href="/merge" className="btn btn-primary px-8 py-3 flex items-center gap-2">
                            Go to PDF Merger <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <section className="prose dark:prose-invert max-w-none mb-20">
                    <h2 className="text-3xl font-bold mb-6">Simplify Your Scholarly Workflow</h2>
                    <p>
                        Academic work often requires juggling multiple document versions, source materials, and appendices. Docify's Academic PDF Merger is designed to take the friction out of this process. Our tool allows you to upload up to 20 files at once and reorder them with simple drag-and-drop functionality.
                    </p>
                    <p>
                        Whether you are preparing a thesis submission, organizing a semester's worth of reading materials, or creating a combined study guide, our lossless merging ensures that your citations, diagrams, and page numbers remain perfectly aligned.
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
