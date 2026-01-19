'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/FileUpload';
import ProgressIndicator from '@/components/ProgressIndicator';
import DownloadButton from '@/components/DownloadButton';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import type { JobStatus } from '@/types';

export default function PDFToXMLPage() {
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
            const uploadedFiles = await api.uploadFiles(files);
            const fileIds = uploadedFiles.map((f) => f.fileId);
            const job = await api.processTool('pdf-to-xml', fileIds);

            setJobId(job.jobId);

            const pollInterval = setInterval(async () => {
                try {
                    const jobData = await api.getJobStatus(job.jobId);
                    setStatus(jobData.status);
                    setProgress(jobData.progress || 0);

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
            }, 1000);

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
            a.download = 'converted.xml';
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
            <div className="max-w-4xl mx-auto text-center">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                    <div className="text-6xl mb-4">🔗</div>
                    <h1 className="text-4xl font-bold mb-4">PDF to XML</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Convert your PDF content to structured XML data with real-time processing</p>
                </motion.div>

                {!processing ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <FileUpload onFilesSelected={setFiles} acceptedFileTypes={['.pdf']} maxFiles={1} multiple={false} />
                        {files.length === 1 && (
                            <button onClick={handleConvert} className="btn btn-primary mt-8 px-12 py-4 text-lg">Convert to XML</button>
                        )}
                    </motion.div>
                ) : (
                    <div className="mt-8">
                        <ProgressIndicator status={status} progress={progress} message={status === 'processing' ? 'Extracting elements...' : status === 'completed' ? 'Success!' : 'Error'} />
                        {status === 'completed' && <div className="mt-6"><DownloadButton onClick={handleDownload} filename="converted.xml" /></div>}
                        {status === 'failed' && <button onClick={() => setProcessing(false)} className="btn btn-outline mt-6">Try Again</button>}
                    </div>
                )}
            </div>
        </div>
    );
}
