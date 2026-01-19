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

export default function SplitPDFPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [splitType, setSplitType] = useState<'fixed' | 'range' | 'all'>('all');
    const [pagesPerFile, setPagesPerFile] = useState(1);
    const [ranges, setRanges] = useState('');
    const [jobId, setJobId] = useState<string | null>(null);
    const [status, setStatus] = useState<JobStatus>('pending');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleSplit = async () => {
        if (files.length !== 1) {
            setError('Please select exactly 1 PDF file');
            return;
        }

        setProcessing(true);
        setStatus('processing');
        setProgress(10);
        setError(null);

        try {
            setProgress(30);
            const uploadedFiles = await api.uploadFiles(files);

            setProgress(50);
            const fileIds = uploadedFiles.map((f) => f.fileId);
            const options = {
                splitType,
                pagesPerFile: splitType === 'fixed' ? pagesPerFile : undefined,
                ranges: splitType === 'range' ? ranges : undefined,
            };

            const job = await api.processTool('split', fileIds, options);

            setJobId(job.jobId);
            setProgress(70);

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

            setTimeout(() => clearInterval(pollInterval), 5 * 60 * 1000);
        } catch (err: any) {
            setStatus('failed');
            setError(err.message || 'Failed to split PDF');
        }
    };

    const handleDownload = async () => {
        if (!jobId) return;

        try {
            const blob = await api.downloadResult(jobId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'split_pdfs.zip';
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
                <Breadcrumbs items={[{ label: 'Split PDF', href: '/split' }]} />
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="text-6xl mb-4">✂️</div>
                    <h1 className="text-4xl font-bold mb-4">Split PDF</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Extract pages or split PDF into multiple files
                    </p>
                </motion.div>

                {!processing && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <FileUpload
                            onFilesSelected={setFiles}
                            acceptedFileTypes={['.pdf']}
                            maxFiles={1}
                            multiple={false}
                        />

                        {files.length === 1 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-8"
                            >
                                <div className="card p-6 mb-6">
                                    <h3 className="font-semibold text-lg mb-4">Split Options</h3>
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            {(['all', 'fixed', 'range'] as const).map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setSplitType(type)}
                                                    className={`px-6 py-3 rounded-lg border-2 transition-all ${splitType === type
                                                        ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                                                        : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                                                        }`}
                                                >
                                                    <span className="capitalize">{type === 'all' ? 'Every Page' : type === 'fixed' ? 'Fixed Chunks' : 'Custom Ranges'}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {splitType === 'fixed' && (
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Pages per file</label>
                                                <input
                                                    type="number"
                                                    value={pagesPerFile}
                                                    onChange={(e) => setPagesPerFile(parseInt(e.target.value) || 1)}
                                                    min="1"
                                                    className="input w-full max-w-xs"
                                                />
                                            </div>
                                        )}

                                        {splitType === 'range' && (
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Custom Ranges (e.g. 1-3, 5, 8-10)</label>
                                                <input
                                                    type="text"
                                                    value={ranges}
                                                    onChange={(e) => setRanges(e.target.value)}
                                                    placeholder="1-3, 5, 8-10"
                                                    className="input w-full"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button
                                        onClick={handleSplit}
                                        className="btn btn-primary text-lg px-12 py-4"
                                    >
                                        Split PDF
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {processing && (
                    <div className="mt-8">
                        <ProgressIndicator
                            status={status}
                            progress={progress}
                            message={
                                status === 'processing'
                                    ? 'Splitting your PDF...'
                                    : status === 'completed'
                                        ? 'Your PDF has been split successfully!'
                                        : status === 'failed'
                                            ? error || 'An error occurred'
                                            : 'Preparing your file...'
                            }
                        />

                        {status === 'completed' && (
                            <div className="mt-6 text-center">
                                <DownloadButton
                                    onClick={handleDownload}
                                    filename="split_pdfs.zip"
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
                        <h2 className="text-3xl font-bold mb-6">How to Split PDF Files and Extract Pages</h2>
                        <div className="prose dark:prose-invert max-w-none">
                            <p>
                                Splitting a PDF document at Docify gives you full control over your files. Whether you need to extract a single important page or break a massive document into smaller, manageable chunks, our flexible splitting options have you covered.
                            </p>
                            <div className="grid md:grid-cols-2 gap-8 my-8">
                                <div className="card p-6 border-l-4 border-purple-500">
                                    <h4 className="font-bold mb-2 text-purple-600">Splitting Options Explored:</h4>
                                    <ul className="text-sm space-y-2">
                                        <li><strong>Every Page:</strong> Turns each page of your PDF into a separate document. Great for batch processing.</li>
                                        <li><strong>Fixed Chunks:</strong> Split by a specific number of pages (e.g., every 5 pages).</li>
                                        <li><strong>Custom Ranges:</strong> Extract specific pages or ranges (e.g., pages 1-3 and 10-12).</li>
                                    </ul>
                                </div>
                                <div className="card p-6 border-l-4 border-indigo-500">
                                    <h4 className="font-bold mb-2 text-indigo-600">Step-by-Step Guide:</h4>
                                    <ol className="text-sm space-y-2">
                                        <li>Upload your source PDF to the secure box above.</li>
                                        <li>Select your preferred splitting mode (Every Page, Fixed, or Custom).</li>
                                        <li>Configure your ranges or chunk sizes if required.</li>
                                        <li>Click "Split PDF" and download your files as a single ZIP archive.</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Use Cases Section */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Practical Use Cases for PDF Splitting</h2>
                        <div className="grid sm:grid-cols-3 gap-6">
                            <div className="p-4 border dark:border-gray-800 rounded-xl">
                                <h4 className="font-bold mb-2 text-blue-600">Invoice Extraction</h4>
                                <p className="text-xs text-gray-500">Extract individual invoices from a large monthly billing PDF for distribution to different clients.</p>
                            </div>
                            <div className="p-4 border dark:border-gray-800 rounded-xl">
                                <h4 className="font-bold mb-2 text-blue-600">Legal Submissions</h4>
                                <p className="text-xs text-gray-500">Separate specific exhibits or appendices from a long legal filing to meet court submission requirements.</p>
                            </div>
                            <div className="p-4 border dark:border-gray-800 rounded-xl">
                                <h4 className="font-bold mb-2 text-blue-600">Academic Modules</h4>
                                <p className="text-xs text-gray-500">Split a massive textbook into individual chapters or lecture notes for easier reading on mobile devices.</p>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section>
                        <h2 className="text-3xl font-bold mb-8 text-center">Split PDF FAQ</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    q: "Can I extract non-consecutive pages?",
                                    a: "Yes! Use the 'Custom Ranges' option and enter your desired pages separated by commas (e.g., 1, 3, 5-10)."
                                },
                                {
                                    q: "Does splitting reduce the quality of my PDF?",
                                    a: "No. Splitting is a structural change. The internal content, images, and fonts of the extracted pages remain identical to the original."
                                },
                                {
                                    q: "What format will I receive my split files in?",
                                    a: "To make downloading easy, we pack all your split PDF files into a single, high-speed ZIP archive."
                                },
                                {
                                    q: "Is it safe to split sensitive documents?",
                                    a: "Docify uses end-to-end HTTPS encryption and permanently wipes all files from our servers within 30 minutes of processing."
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
