'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/FileUpload';
import PDFPreview from '@/components/PDFPreview';
import ProgressIndicator from '@/components/ProgressIndicator';
import DownloadButton from '@/components/DownloadButton';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import type { JobStatus } from '@/types';

export default function ReorderPagesPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [options, setOptions] = useState<any>({});
    const [jobId, setJobId] = useState<string | null>(null);
    const [status, setStatus] = useState<JobStatus>('pending');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleProcess = async () => {
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
            const job = await api.processTool('reorder', fileIds, options);

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
            setError(err.message || 'Failed to reorder pages');
        }
    };

    const handleDownload = async () => {
        if (!jobId) return;
        try {
            const blob = await api.downloadResult(jobId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'reordered.pdf';
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
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="text-6xl mb-4">🔄</div>
                    <h1 className="text-4xl font-bold mb-4">Reorder Pages</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Rearrange pages in your PDF document easily</p>
                </motion.div>

                {!processing && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        {files.length === 0 ? (
                            <FileUpload onFilesSelected={setFiles} acceptedFileTypes={['.pdf']} maxFiles={1} multiple={false} />
                        ) : (
                            <div className="space-y-8">
                                <PDFPreview
                                    file={files[0]}
                                    mode="reorder"
                                    onUpdate={setOptions}
                                />

                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={() => setFiles([])}
                                        className="btn btn-outline px-8"
                                    >
                                        Change File
                                    </button>
                                    <button
                                        onClick={handleProcess}
                                        className="btn btn-primary text-lg px-12 py-4"
                                    >
                                        Apply New Order
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {processing && (
                    <div className="mt-8">
                        <ProgressIndicator status={status} progress={progress} message={status === 'processing' ? 'Processing...' : status === 'completed' ? 'Success!' : 'Error'} />
                        {status === 'completed' && <div className="mt-6 text-center"><DownloadButton onClick={handleDownload} filename="reordered.pdf" /></div>}
                        {status === 'failed' && <div className="mt-6 text-center"><button onClick={() => setProcessing(false)} className="btn btn-outline">Try Again</button></div>}
                    </div>
                )}
            </div>
        </div>
    );
}
