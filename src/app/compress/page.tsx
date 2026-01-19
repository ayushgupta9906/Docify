'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ProgressIndicator from '@/components/ProgressIndicator';
import DownloadButton from '@/components/DownloadButton';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import type { JobStatus } from '@/types';

import Breadcrumbs from '@/components/Breadcrumbs';
import AuthorCard from '@/components/AuthorCard';
import { AUTHORS } from '@/lib/authors';

export default function CompressPDFPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
    const [jobId, setJobId] = useState<string | null>(null);
    const [status, setStatus] = useState<JobStatus>('pending');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [canProcessAgain, setCanProcessAgain] = useState(false);
    const [processedFileId, setProcessedFileId] = useState<string | null>(null);

    const handleCompress = async () => {
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
            const job = await api.processTool('compress', fileIds, { quality });

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
            setError(err.message || 'Failed to compress PDF');
            setProcessing(false);
        }
    };

    const handleDownload = async () => {
        if (!jobId) return;

        try {
            const blob = await api.downloadResult(jobId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'compressed.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Enable re-processing
            setCanProcessAgain(true);
            setProcessedFileId(jobId);
        } catch (err) {
            setError('Failed to download file');
        }
    };

    const handleCompressAgain = async () => {
        if (!processedFileId) return;

        setProcessing(true);
        setStatus('processing');
        setProgress(10);
        setError(null);
        setCanProcessAgain(false);

        try {
            setProgress(50);
            // Use previous output as new input
            const job = await api.processTool('compress', [processedFileId], { quality });

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
            setError(err.message || 'Failed to compress PDF');
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Breadcrumbs items={[{ label: 'Compress PDF', href: '/compress' }]} />
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="text-6xl mb-4">🗜️</div>
                    <h1 className="text-4xl font-bold mb-4">Compress PDF</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Reduce file size while maintaining quality
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
                                {/* Quality Selector */}
                                <div className="card p-6 mb-6">
                                    <h3 className="font-semibold text-lg mb-4">Compression Quality</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {(['low', 'medium', 'high'] as const).map((q) => (
                                            <button
                                                key={q}
                                                onClick={() => setQuality(q)}
                                                className={`p-4 rounded-lg border-2 transition-all ${quality === q
                                                    ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                                                    : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                                                    }`}
                                            >
                                                <div className="font-semibold capitalize">{q}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {q === 'low' && '72 DPI - Smallest size'}
                                                    {q === 'medium' && '150 DPI - Balanced'}
                                                    {q === 'high' && '300 DPI - Best quality'}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button
                                        onClick={handleCompress}
                                        className="btn btn-primary text-lg px-12 py-4"
                                    >
                                        Compress PDF
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
                                    ? 'Compressing your PDF...'
                                    : status === 'completed'
                                        ? 'Your PDF has been compressed successfully!'
                                        : status === 'failed'
                                            ? error || 'An error occurred'
                                            : 'Preparing your file...'
                            }
                        />

                        {status === 'completed' && (
                            <>
                                <div className="mt-6 text-center">
                                    <DownloadButton
                                        onClick={handleDownload}
                                        filename="compressed.pdf"
                                    />
                                </div>

                                {canProcessAgain && (
                                    <div className="mt-4 text-center">
                                        <button
                                            onClick={handleCompressAgain}
                                            className="btn btn-outline px-8 py-3"
                                        >
                                            🗜️ Compress More
                                        </button>
                                    </div>
                                )}
                            </>
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
                        <h2 className="text-3xl font-bold mb-6">How to Compress PDF Without Losing Quality</h2>
                        <div className="prose dark:prose-invert max-w-none">
                            <p>
                                Reducing the size of your PDF documents at Docify is optimized to ensure that your text remains sharp and your images clear. We use advanced algorithms to strip unnecessary metadata and downsample high-resolution images according to your selected quality level.
                            </p>
                            <div className="grid md:grid-cols-2 gap-8 my-8">
                                <div className="card p-6 border-l-4 border-blue-500">
                                    <h4 className="font-bold mb-2">Technical Compression Levels:</h4>
                                    <ul className="text-sm space-y-2">
                                        <li><strong>Extreme (72 DPI):</strong> Ideal for email attachments and mobile devices.</li>
                                        <li><strong>Recommended (150 DPI):</strong> The perfect balance between size and quality.</li>
                                        <li><strong>Minimum (300 DPI):</strong> High-fidelity compression for professional printing.</li>
                                    </ul>
                                </div>
                                <div className="card p-6 border-l-4 border-green-500">
                                    <h4 className="font-bold mb-2">Step-by-Step Guide:</h4>
                                    <ol className="text-sm space-y-2">
                                        <li>Drop your PDF into the compressor above.</li>
                                        <li>Choose your desired compression quality.</li>
                                        <li>Click "Compress PDF" and wait for the magic.</li>
                                        <li>Download your optimized, smaller file.</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Use Cases Section */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Common Use Cases for PDF Compression</h2>
                        <div className="grid sm:grid-cols-3 gap-6">
                            <div className="p-4 border dark:border-gray-800 rounded-xl">
                                <h4 className="font-bold mb-2 text-indigo-600">Email Ready</h4>
                                <p className="text-xs text-gray-500">Shrink large reports and resumes to fit within standard email attachment limits (usually 25MB).</p>
                            </div>
                            <div className="p-4 border dark:border-gray-800 rounded-xl">
                                <h4 className="font-bold mb-2 text-indigo-600">Portal Submissions</h4>
                                <p className="text-xs text-gray-500">Optimize academic papers or government forms for portals with strict file size restrictions.</p>
                            </div>
                            <div className="p-4 border dark:border-gray-800 rounded-xl">
                                <h4 className="font-bold mb-2 text-indigo-600">Web Performance</h4>
                                <p className="text-xs text-gray-500">Enable faster page loads for your website visitors by compressing PDFs before hosting them online.</p>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section>
                        <h2 className="text-3xl font-bold mb-8 text-center">Compress PDF FAQ</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    q: "Is PDF compression safe for sensitive data?",
                                    a: "Absolutely. Docify uses 256-bit encryption for all file transfers and your documents are automatically deleted after 30 minutes."
                                },
                                {
                                    q: "Does compression change my layouts?",
                                    a: "No. Our compression only targets redundant data and image resolutions. Your text formatting and layouts remain identical."
                                },
                                {
                                    q: "Can I compress a PDF multiple times?",
                                    a: "Yes! You can use our 'Compress More' feature to further reduce size, though note that quality may degrade with repeated extreme compression."
                                },
                                {
                                    q: "Is there a limit on file size?",
                                    a: "We support files up to 100MB for free online compression. For larger files, please split them before compressing."
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
                    <AuthorCard author={AUTHORS['security-expert']} />
                </div>
            </div>
        </div>
    );
}
