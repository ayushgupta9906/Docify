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

export default function WordToPDFPage() {
    const router = useRouter();
    const [files, setFiles] = useState<File[]>([]);
    const [jobId, setJobId] = useState<string | null>(null);
    const [status, setStatus] = useState<JobStatus>('pending');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleConvert = async () => {
        if (files.length !== 1) {
            setError('Please select exactly one Word file');
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
            const job = await api.processTool('word-to-pdf', fileIds);

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
                        setError(jobData.error || 'Conversion failed');
                    }
                } catch (err) {
                    console.error('Polling error:', err);
                }
            }, 2000);

            setTimeout(() => clearInterval(pollInterval), 5 * 60 * 1000);
        } catch (err: any) {
            setStatus('failed');
            setError(err.message || 'Failed to convert Word file');
        }
    };

    const handleDownload = async () => {
        if (!jobId) return;

        try {
            const blob = await api.downloadResult(jobId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'converted.pdf';
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
                <Breadcrumbs items={[{ label: 'Word to PDF', href: '/word-to-pdf' }]} />
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="text-6xl mb-4">📝</div>
                    <h1 className="text-4xl font-bold mb-4">Word to PDF</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Convert your Microsoft Word documents to professional PDF files
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
                            acceptedFileTypes={['.doc', '.docx']}
                            maxFiles={1}
                            multiple={false}
                        />

                        {files.length === 1 && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={handleConvert}
                                    className="btn btn-primary text-lg px-12 py-4"
                                >
                                    Convert to PDF
                                </button>
                            </div>
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
                                    ? 'Converting your document...'
                                    : status === 'completed'
                                        ? 'Your document has been converted to PDF successfully!'
                                        : status === 'failed'
                                            ? error || 'An error occurred'
                                            : 'Preparing your file...'
                            }
                        />

                        {status === 'completed' && (
                            <div className="mt-6 text-center">
                                <DownloadButton
                                    onClick={handleDownload}
                                    filename="converted.pdf"
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
                        <h2 className="text-3xl font-bold mb-6">How to Convert Word to PDF Online with Pro Quality</h2>
                        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                            <p>
                                Creating a professional PDF from your Microsoft Word documents shouldn't sacrifice your styling, margins, or font choices. Docify's conversion engine ensures that every bullet point, table, and image placement is preserved with pixel-perfect accuracy.
                            </p>
                            <div className="grid md:grid-cols-2 gap-8 my-8">
                                <div className="card p-6 border-l-4 border-blue-500">
                                    <h4 className="font-bold mb-2">High-Fidelity Rendering:</h4>
                                    <ul className="text-sm space-y-2">
                                        <li><strong>Font Embedding:</strong> We ensure that your chosen fonts are embedded correctly for universal viewing.</li>
                                        <li><strong>Hyperlink Support:</strong> All internal and external links in your Word file remain clickable in the PDF.</li>
                                        <li><strong>Vector Preservation:</strong> Graphs and charts are kept in vector format for infinite scalability.</li>
                                    </ul>
                                </div>
                                <div className="card p-6 border-l-4 border-indigo-500">
                                    <h4 className="font-bold mb-2">Instant Conversion Steps:</h4>
                                    <ol className="text-sm space-y-2">
                                        <li>Select your .doc or .docx file and upload it to our secure server.</li>
                                        <li>Our high-speed engine converts your document into a professional PDF.</li>
                                        <li>Download your file and share it with confidence.</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Use Cases Section */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Why Convert Word to PDF?</h2>
                        <div className="grid sm:grid-cols-3 gap-6">
                            <div className="p-4 border dark:border-gray-800 rounded-xl">
                                <h4 className="font-bold mb-2 text-blue-600">Secure Distribution</h4>
                                <p className="text-xs text-gray-500">Lock your document's formatting so it looks the same on every device, from mobile to desktop.</p>
                            </div>
                            <div className="p-4 border dark:border-gray-800 rounded-xl">
                                <h4 className="font-bold mb-2 text-blue-600">Professional Printing</h4>
                                <p className="text-xs text-gray-500">Ensure your brochures, resumes, and reports are print-ready with embedded fonts and high-res images.</p>
                            </div>
                            <div className="p-4 border dark:border-gray-800 rounded-xl">
                                <h4 className="font-bold mb-2 text-blue-600">Legal Standard</h4>
                                <p className="text-xs text-gray-500">PDF is the global standard for legal and official documents, ensuring long-term readability and archiving.</p>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section>
                        <h2 className="text-3xl font-bold mb-8 text-center">Word to PDF FAQ</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    q: "Will my margins and padding change?",
                                    a: "No. Our converter respects the exact margin and layout settings defined in your Word document."
                                },
                                {
                                    q: "Can I convert large Word files?",
                                    a: "Yes, we support files up to 100MB, which is usually enough for even the most image-heavy reports or books."
                                },
                                {
                                    q: "Is it safe to upload confidential files?",
                                    a: "Absolutely. We use 256-bit SSL encryption for the transfer and delete all files automatically after 30 minutes."
                                },
                                {
                                    q: "Do I need Adobe Acrobat?",
                                    a: "No. Our online tool provides professional-grade PDF conversion directly in your browser without any extra software."
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
