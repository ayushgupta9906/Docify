'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/FileUpload';
import ProgressIndicator from '@/components/ProgressIndicator';
import DownloadButton from '@/components/DownloadButton';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import type { JobStatus } from '@/types';

export default function PageNumbersPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [position, setPosition] = useState<'bottom-center' | 'bottom-right' | 'top-right'>('bottom-center');
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
            const job = await api.processTool('page-numbers', fileIds, { position });

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
            setError(err.message || 'Failed to add page numbers');
        }
    };

    const handleDownload = async () => {
        if (!jobId) return;
        try {
            const blob = await api.downloadResult(jobId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'numbered.pdf';
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
                    <div className="text-6xl mb-4">🔢</div>
                    <h1 className="text-4xl font-bold mb-4">Page Numbers</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Add page numbers to your PDF document</p>
                </motion.div>

                {!processing && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <FileUpload onFilesSelected={setFiles} acceptedFileTypes={['.pdf']} maxFiles={1} multiple={false} />
                        {files.length === 1 && (
                            <div className="mt-8 space-y-4 max-w-sm mx-auto">
                                <select value={position} onChange={(e) => setPosition(e.target.value as any)} className="input w-full">
                                    <option value="bottom-center">Bottom Center</option>
                                    <option value="bottom-right">Bottom Right</option>
                                    <option value="top-right">Top Right</option>
                                </select>
                                <button onClick={handleProcess} className="btn btn-primary w-full py-4">Add Page Numbers</button>
                            </div>
                        )}
                    </motion.div>
                )}

                {processing && (
                    <div className="mt-8">
                        <ProgressIndicator status={status} progress={progress} message={status === 'processing' ? 'Adding page numbers...' : status === 'completed' ? 'Success!' : 'Error'} />
                        {status === 'completed' && <div className="mt-6 text-center"><DownloadButton onClick={handleDownload} filename="numbered.pdf" /></div>}
                        {status === 'failed' && <div className="mt-6 text-center"><button onClick={() => setProcessing(false)} className="btn btn-outline">Try Again</button></div>}
                    </div>
                )}
            </div>
        </div>
    );
}
