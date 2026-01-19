'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ProgressIndicator from '@/components/ProgressIndicator';
import DownloadButton from '@/components/DownloadButton';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, FileText, Code, Table } from 'lucide-react';
import type { JobStatus } from '@/types';

const TARGET_FORMATS = [
    { id: 'markdown', label: 'Markdown', icon: FileText, color: 'text-blue-500' },
    { id: 'json', label: 'JSON', icon: Code, color: 'text-yellow-500' },
    { id: 'csv', label: 'CSV', icon: Table, color: 'text-green-500' },
    { id: 'xml', label: 'XML', icon: Code, color: 'text-orange-500' },
    { id: 'plain text', label: 'Plain Text', icon: FileText, color: 'text-gray-500' },
    { id: 'html', label: 'HTML', icon: Code, color: 'text-purple-500' },
];

export default function SmartConvertPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState<JobStatus>('pending');
    const [progress, setProgress] = useState(0);
    const [jobId, setJobId] = useState<string | null>(null);
    const [targetFormat, setTargetFormat] = useState('markdown');
    const [customFormat, setCustomFormat] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleProcess = async () => {
        if (files.length === 0) return;

        setProcessing(true);
        setStatus('processing');
        setProgress(10);
        setError(null);

        try {
            // 1. Upload
            setProgress(30);
            const uploaded = await api.uploadFiles(files);
            const fileIds = uploaded.map(f => f.fileId);

            // 2. Start Processing
            setProgress(50);
            const format = customFormat || targetFormat;
            const job = await api.processTool('smart-convert', fileIds, { targetFormat: format });
            setJobId(job.jobId);

            // 3. Polling
            const pollInterval = setInterval(async () => {
                try {
                    const jobData = await api.getJobStatus(job.jobId);
                    setStatus(jobData.status);
                    setProgress(jobData.progress || 50);

                    if (jobData.status === 'completed') {
                        clearInterval(pollInterval);
                        setProgress(100);
                    } else if (jobData.status === 'failed') {
                        clearInterval(pollInterval);
                        setError(jobData.error || 'AI conversion failed');
                    }
                } catch (err) {
                    console.error('Polling error:', err);
                }
            }, 2000);

            setTimeout(() => clearInterval(pollInterval), 10 * 60 * 1000); // 10 min timeout for AI
        } catch (err: any) {
            setStatus('failed');
            setError(err.message || 'AI conversion failed. Please try again.');
        }
    };

    const handleDownload = async () => {
        if (!jobId) return;
        try {
            const blob = await api.downloadResult(jobId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const ext = (customFormat || targetFormat).toLowerCase().includes('json') ? 'json' :
                (customFormat || targetFormat).toLowerCase().includes('xml') ? 'xml' : 'md';
            a.download = `converted.${ext}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            setError('Failed to download file');
        }
    };

    const handleReset = () => {
        setFiles([]);
        setProcessing(false);
        setStatus('pending');
        setJobId(null);
        setError(null);
        setProgress(0);
    };

    return (
        <div className="container-main py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 mb-6"
                    >
                        <Sparkles className="w-8 h-8" />
                    </motion.div>
                    <h1 className="text-4xl font-bold mb-4">Smart AI Convert</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Convert any file to any format using advanced AI intelligence.
                        Perfect for scanned PDFs, structured data, and complex layouts.
                    </p>
                </div>

                <div className="card p-8 mb-8">
                    {!processing && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">1. Upload your file</h3>
                                <FileUpload
                                    onFilesSelected={setFiles}
                                    maxFiles={1}
                                    acceptedFileTypes={['.pdf', '.docx', '.xlsx', '.jpg', '.jpeg', '.png', '.txt', '.csv', '.json', '.xml', '.md', '.html']}
                                />
                            </div>

                            <AnimatePresence>
                                {files.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">2. Select target format</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {TARGET_FORMATS.map((format) => (
                                                    <button
                                                        key={format.id}
                                                        onClick={() => {
                                                            setTargetFormat(format.id);
                                                            setCustomFormat('');
                                                        }}
                                                        className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${targetFormat === format.id && !customFormat
                                                                ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                                                                : 'border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                            }`}
                                                    >
                                                        <format.icon className={`w-6 h-6 mb-2 ${format.color}`} />
                                                        <span className="text-sm font-medium">{format.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Or enter a custom format (e.g., "YAML", "SQL", "TypeScript")
                                            </label>
                                            <input
                                                type="text"
                                                value={customFormat}
                                                onChange={(e) => setCustomFormat(e.target.value)}
                                                placeholder="Enter format..."
                                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 outline-none bg-white dark:bg-gray-800"
                                            />
                                        </div>

                                        <button
                                            onClick={handleProcess}
                                            className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                            Convert with AI
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {processing && (
                        <div className="py-12">
                            <ProgressIndicator
                                status={status}
                                progress={progress}
                                message={
                                    status === 'processing'
                                        ? 'AI is analyzing and converting your file...'
                                        : status === 'completed'
                                            ? 'Your file has been intelligently converted!'
                                            : status === 'failed'
                                                ? error || 'An error occurred'
                                                : 'Preparing AI engine...'
                                }
                            />

                            {status === 'completed' && jobId && (
                                <div className="mt-8 text-center space-y-6">
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <DownloadButton
                                            onClick={handleDownload}
                                            filename={`converted.${(customFormat || targetFormat).toLowerCase().includes('json') ? 'json' : 'md'}`}
                                        />
                                        <button
                                            onClick={handleReset}
                                            className="px-8 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            Convert Another
                                        </button>
                                    </div>
                                </div>
                            )}

                            {status === 'failed' && (
                                <div className="mt-8 text-center">
                                    <button
                                        onClick={handleReset}
                                        className="px-8 py-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl font-bold transition-opacity hover:opacity-90"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20">
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-blue-500" />
                            Intelligent OCR
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Our AI mentally reconstructs scanned or image-based content, ensuring tables and hierarchies remain intact.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-purple-50 dark:bg-purple-900/20">
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-500" />
                            Semantic Fidelity
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Preserves the meaning of headings, lists, and code blocks rather than just visual appearance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
