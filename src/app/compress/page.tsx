'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ProgressIndicator from '@/components/ProgressIndicator';
import DownloadButton from '@/components/DownloadButton';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import type { JobStatus } from '@/types';

export default function CompressPDFPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
    const [jobId, setJobId] = useState<string | null>(null);
    const [status, setStatus] = useState<JobStatus>('pending');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

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
        } catch (err) {
            setError('Failed to download file');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
            <div className="max-w-4xl mx-auto">
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
                            <div className="mt-6 text-center">
                                <DownloadButton
                                    onClick={handleDownload}
                                    filename="compressed.pdf"
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
            </div>
        </div>
    );
}
