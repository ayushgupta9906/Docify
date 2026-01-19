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

export default function PDFToWordPage() {
    const router = useRouter();
    const [files, setFiles] = useState<File[]>([]);
    const [jobId, setJobId] = useState<string | null>(null);
    const [status, setStatus] = useState<JobStatus>('pending');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleConvert = async () => {
        if (files.length !== 1) {
            setError('Please select exactly one PDF file');
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
            const job = await api.processTool('pdf-to-word', fileIds);

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
            setError(err.message || 'Failed to convert PDF');
        }
    };

    const handleDownload = async () => {
        if (!jobId) return;

        try {
            const blob = await api.downloadResult(jobId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'converted.docx';
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
                <Breadcrumbs items={[{ label: 'PDF to Word', href: '/pdf-to-word' }]} />
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="text-6xl mb-4">📄</div>
                    <h1 className="text-4xl font-bold mb-4">PDF to Word</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Convert your PDF documents to editable Microsoft Word files
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
                            <div className="mt-8 text-center">
                                <button
                                    onClick={handleConvert}
                                    className="btn btn-primary text-lg px-12 py-4"
                                >
                                    Convert to Word
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
                                    ? 'Converting your PDF...'
                                    : status === 'completed'
                                        ? 'Your PDF has been converted to Word successfully!'
                                        : status === 'failed'
                                            ? error || 'An error occurred'
                                            : 'Preparing your file...'
                            }
                        />

                        {status === 'completed' && (
                            <div className="mt-6 text-center">
                                <DownloadButton
                                    onClick={handleDownload}
                                    filename="converted.docx"
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
                        <h2 className="text-3xl font-bold mb-6">How to Convert PDF to Word Online for Free</h2>
                        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                            <p>
                                Converting your PDF files into editable Microsoft Word documents is a seamless experience with Docify. Our conversion engine analyzes your PDF's internal structure—fonts, tables, and images—to recreate a high-fidelity DOCX file that looks exactly like your original.
                            </p>
                            <div className="grid md:grid-cols-2 gap-8 my-8">
                                <div className="card p-6 border-l-4 border-blue-500">
                                    <h4 className="font-bold mb-2">Advanced Conversion Features:</h4>
                                    <ul className="text-sm space-y-2">
                                        <li><strong>Layout Preservation:</strong> Headers, footers, and sidebars remain in their original positions.</li>
                                        <li><strong>Table Reconstruction:</strong> Complex tables are converted into editable Word tables.</li>
                                        <li><strong>OCR Support:</strong> Scanned PDFs are converted using our AI-powered OCR engine.</li>
                                    </ul>
                                </div>
                                <div className="card p-6 border-l-4 border-indigo-500">
                                    <h4 className="font-bold mb-2">3-Step Conversion Guide:</h4>
                                    <ol className="text-sm space-y-2">
                                        <li>Upload your PDF file to the converter box above.</li>
                                        <li>Click "Convert to Word" and wait for the AI to process the layout.</li>
                                        <li>Download your editable .docx file instantly.</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Use Cases Section */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Why Professionals Convert PDF to Word</h2>
                        <div className="grid sm:grid-cols-3 gap-6">
                            <div className="p-4 border dark:border-gray-800 rounded-xl">
                                <h4 className="font-bold mb-2 text-blue-600">Editing Contracts</h4>
                                <p className="text-xs text-gray-500">Easily modify and redline legal agreements that were previously locked in PDF format.</p>
                            </div>
                            <div className="p-4 border dark:border-gray-800 rounded-xl">
                                <h4 className="font-bold mb-2 text-blue-600">Resume Updates</h4>
                                <p className="text-xs text-gray-500">Quickly update your CV or portfolio without needing the original source file.</p>
                            </div>
                            <div className="p-4 border dark:border-gray-800 rounded-xl">
                                <h4 className="font-bold mb-2 text-blue-600">Data Re-use</h4>
                                <p className="text-xs text-gray-500">Extract text and images from academic papers or reports for use in new presentations.</p>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section>
                        <h2 className="text-3xl font-bold mb-8 text-center">PDF to Word FAQ</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    q: "Will the formatting change after conversion?",
                                    a: "We strive for 100% accuracy. Most standard documents retain their exact layout, fonts, and table structures in the resulting Word file."
                                },
                                {
                                    q: "Can I convert scanned PDFs to Word?",
                                    a: "Yes! Docify automatically detects scanned images and uses Optical Character Recognition (OCR) to create editable text."
                                },
                                {
                                    q: "Is it safe to convert private documents?",
                                    a: "Absolutely. We use end-to-end HTTPS encryption and our servers automatically delete all files 30 minutes after conversion."
                                },
                                {
                                    q: "Do I need to install Microsoft Word?",
                                    a: "No. The conversion happens entirely in the cloud. You only need a PDF file and a web browser."
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
