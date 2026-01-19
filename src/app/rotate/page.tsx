'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/FileUpload';
import ProgressIndicator from '@/components/ProgressIndicator';
import DownloadButton from '@/components/DownloadButton';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import type { JobStatus } from '@/types';

export default function RotatePDFPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [rotation, setRotation] = useState<90 | 180 | 270>(90);
    const [jobId, setJobId] = useState<string | null>(null);
    const [status, setStatus] = useState<JobStatus>('pending');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleRotate = async () => {
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
                rotation,
            };

            const job = await api.processTool('rotate', fileIds, options);

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
            setError(err.message || 'Failed to rotate PDF');
        }
    };

    const handleDownload = async () => {
        if (!jobId) return;

        try {
            const blob = await api.downloadResult(jobId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'rotated.pdf';
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
                    <div className="text-6xl mb-4">🔄</div>
                    <h1 className="text-4xl font-bold mb-4">Rotate PDF</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Rotate all pages in your PDF document
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
                                    <h3 className="font-semibold text-lg mb-4">Rotation Angle</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {([90, 180, 270] as const).map((angle) => (
                                            <button
                                                key={angle}
                                                onClick={() => setRotation(angle)}
                                                className={`p-6 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${rotation === angle
                                                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                                                    : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                                                    }`}
                                            >
                                                <div
                                                    className="text-3xl mb-2 transition-transform duration-300"
                                                    style={{ transform: `rotate(${angle}deg)` }}
                                                >
                                                    📄
                                                </div>
                                                <div className="font-bold">{angle}°</div>
                                                <div className="text-xs opacity-60">
                                                    {angle === 90 && 'Clockwise'}
                                                    {angle === 180 && 'Upside down'}
                                                    {angle === 270 && 'Counter-clockwise'}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button
                                        onClick={handleRotate}
                                        className="btn btn-primary text-lg px-12 py-4"
                                    >
                                        Rotate PDF
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
                                    ? 'Rotating your PDF...'
                                    : status === 'completed'
                                        ? 'Your PDF has been rotated successfully!'
                                        : status === 'failed'
                                            ? error || 'An error occurred'
                                            : 'Preparing your file...'
                            }
                        />

                        {status === 'completed' && (
                            <div className="mt-6 text-center">
                                <DownloadButton
                                    onClick={handleDownload}
                                    filename="rotated.pdf"
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
