'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/FileUpload';
import ProgressIndicator from '@/components/ProgressIndicator';
import DownloadButton from '@/components/DownloadButton';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import type { JobStatus } from '@/types';
import Breadcrumbs from '@/components/Breadcrumbs';

import AuthorCard from '@/components/AuthorCard';
import { AUTHORS } from '@/lib/authors';

export default function MergePDFPage() {
    const router = useRouter();
    const [files, setFiles] = useState<File[]>([]);
    const [jobId, setJobId] = useState<string | null>(null);
    const [status, setStatus] = useState<JobStatus>('pending');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleMerge = async () => {
        if (files.length < 2) {
            setError('Please select at least 2 PDF files to merge');
            return;
        }

        setProcessing(true);
        setStatus('processing');
        setProgress(10);
        setError(null);

        try {
            // Upload files
            setProgress(30);
            const uploadedFiles = await api.uploadFiles(files);

            // Process merge
            setProgress(50);
            const fileIds = uploadedFiles.map((f) => f.fileId);
            const job = await api.processTool('merge', fileIds);

            setJobId(job.jobId);
            setProgress(70);

            // Poll for status
            const pollInterval = setInterval(async () => {
                try {
                    const jobData = await api.getJobStatus(job.jobId);
                    setStatus(jobData.status);
                    setProgress(jobData.progress || 70);

                    if (jobData.status === 'completed') {
                        clearInterval(pollInterval);
                        setProgress(100);
                    } else if (jobData.status === 'failed') {
                        clearInterval(pollInterval);
                        setError(jobData.error || 'Processing failed');
                    }
                } catch (err) {
                    console.error('Polling error:', err);
                }
            }, 2000);

            setTimeout(() => clearInterval(pollInterval), 5 * 60 * 1000); // 5 min timeout
        } catch (err: any) {
            setStatus('failed');
            setError(err.message || 'Failed to merge PDFs');
        }
    };

    const handleDownload = async () => {
        if (!jobId) return;

        try {
            const blob = await api.downloadResult(jobId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'merged.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            setError('Failed to download file');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Breadcrumbs items={[{ label: 'Merge PDF', href: '/merge' }]} />
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="text-6xl mb-4">🔗</div>
                    <h1 className="text-4xl font-bold mb-4">Merge PDF Files</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Combine multiple PDFs into a single document
                    </p>
                </motion.div>

                {/* Upload Section */}
                {!processing && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <FileUpload
                            onFilesSelected={setFiles}
                            acceptedFileTypes={['.pdf']}
                            maxFiles={20}
                            multiple={true}
                        />

                        {files.length >= 2 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-8 text-center"
                            >
                                <button
                                    onClick={handleMerge}
                                    className="btn btn-primary text-lg px-12 py-4"
                                >
                                    Merge {files.length} PDFs
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Processing Status */}
                {processing && (
                    <div className="mt-8">
                        <ProgressIndicator
                            status={status}
                            progress={progress}
                            message={
                                status === 'processing'
                                    ? 'Merging your PDF files...'
                                    : status === 'completed'
                                        ? 'Your PDFs have been merged successfully!'
                                        : status === 'failed'
                                            ? error || 'An error occurred'
                                            : 'Preparing your files...'
                            }
                        />

                        {status === 'completed' && (
                            <div className="mt-6 text-center">
                                <DownloadButton
                                    onClick={handleDownload}
                                    filename="merged.pdf"
                                />
                            </div>
                        )}

                        {status === 'failed' && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => {
                                        setProcessing(false);
                                        setStatus('pending');
                                        setProgress(0);
                                        setError(null);
                                    }}
                                    className="btn btn-outline"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* High Depth SEO Content */}
                <div className="mt-20 space-y-16">
                    {/* How to Section (Featured Snippet) */}
                    <section>
                        <h2 className="text-3xl font-bold mb-6">How to Merge PDF Files Online for Free</h2>
                        <div className="prose dark:prose-invert max-w-none">
                            <p>
                                Merging PDF documents at Docify is a straightforward process designed for both security and speed. Whether you are combining academic transcripts, legal contracts, or monthly financial statements, our engine ensures that your page order and formatting remain 100% intact.
                            </p>
                            <ol className="space-y-4">
                                <li><strong>Upload your PDFs:</strong> Click the upload button or drag and drop your files into the secure dropzone. You can upload multiple files at once.</li>
                                <li><strong>Arrange the order:</strong> Drag and drop the file previews to set the exact order you want them to appear in the final document.</li>
                                <li><strong>Process & Download:</strong> Click the "Merge" button. Our server will join the files in seconds. Once finished, download your combined PDF instantly.</li>
                            </ol>
                        </div>
                    </section>

                    {/* Why Use Docify Section */}
                    <section className="grid md:grid-cols-2 gap-12 bg-gray-50 dark:bg-gray-900/50 p-8 rounded-3xl">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Why use our PDF Merger?</h3>
                            <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--primary)] font-bold">✓</span>
                                    <span><strong>Fast Processing:</strong> No waiting in queues. Our Node.js backend handles merging in milliseconds.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--primary)] font-bold">✓</span>
                                    <span><strong>Secure & Private:</strong> Files are end-to-end encrypted and deleted automatically after 30 minutes.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--primary)] font-bold">✓</span>
                                    <span><strong>No Limits:</strong> Unlike other tools, we allow up to 20 files per merge for free.</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Industry Use Cases</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Professionals across various fields trust Docify for their document joining needs:
                            </p>
                            <div className="flex flex-wrap gap-2 text-xs">
                                <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full border">Lawyers & Contracts</span>
                                <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full border">Students & Reports</span>
                                <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full border">Real Estate Portfolios</span>
                                <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full border">HR Documentation</span>
                            </div>
                        </div>
                    </section>

                    {/* Tool Specific FAQ */}
                    <section>
                        <h2 className="text-3xl font-bold mb-8 text-center">Merge PDF FAQ</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    q: "Can I merge password-protected PDFs?",
                                    a: "Yes, you can upload protected files, but you may need to provide the password before they can be merged into a new document."
                                },
                                {
                                    q: "Is there a file size limit for merging?",
                                    a: "You can merge files up to 100MB each. This allows for even the most complex, high-resolution document combinations."
                                },
                                {
                                    q: "Will merging affect the quality of my images?",
                                    a: "No. Our merging process is 'lossless' for images and text formatting. It simply joins the internal structures of the PDFs."
                                },
                                {
                                    q: "Can I combine PDF with Word or Excel?",
                                    a: "Yes! Use our universal converter first to turn your Word/Excel to PDF, then merge them here seamlessly."
                                }
                            ].map((faq, i) => (
                                <div key={i} className="card p-6">
                                    <h4 className="font-bold mb-2">{faq.q}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="mt-20 border-t pt-12">
                    <h3 className="text-xl font-bold mb-6 text-center">About the Author</h3>
                    <AuthorCard author={AUTHORS['pdf-specialist']} />
                </div>
            </div>
        </div>
    );
}
