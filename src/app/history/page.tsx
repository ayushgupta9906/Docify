'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDate, formatFileSize } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Clock, Download, FileText } from 'lucide-react';
import type { Job } from '@/types';

export default function HistoryPage() {
    const { data: jobs, isLoading, error } = useQuery({
        queryKey: ['jobs'],
        queryFn: api.getJobs,
        refetchInterval: 5000, // Poll every 5 seconds
    });

    const handleDownload = async (jobId: string, filename: string) => {
        try {
            const blob = await api.downloadResult(jobId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            alert('Failed to download file');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
            <div className="container-main">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold mb-4">Processing History</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        View your recent file processing jobs
                    </p>
                </motion.div>

                {isLoading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading history...</p>
                    </div>
                )}

                {error && (
                    <div className="card p-8 text-center">
                        <p className="text-red-600 dark:text-red-400">
                            Failed to load history. Please try again later.
                        </p>
                    </div>
                )}

                {jobs && jobs.length === 0 && (
                    <div className="card p-12 text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold mb-2">No processing history</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Start processing files to see them here
                        </p>
                    </div>
                )}

                {jobs && jobs.length > 0 && (
                    <div className="space-y-4">
                        {jobs.map((job: Job) => (
                            <motion.div
                                key={job.jobId}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="card p-6"
                            >
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white capitalize">
                                                {job.tool}
                                            </span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${job.status === 'completed'
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                        : job.status === 'failed'
                                                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                                    }`}
                                            >
                                                {job.status}
                                            </span>
                                        </div>

                                        <p className="font-medium truncate mb-1">
                                            {job.inputFiles?.map((f) => f.originalName).join(', ')}
                                        </p>

                                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="flex items-center space-x-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{formatDate(job.createdAt)}</span>
                                            </span>
                                            {job.outputFile && (
                                                <span>{formatFileSize(job.outputFile.size)}</span>
                                            )}
                                        </div>

                                        {job.error && (
                                            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                                                Error: {job.error}
                                            </p>
                                        )}
                                    </div>

                                    {job.status === 'completed' && job.outputFile && (
                                        <button
                                            onClick={() => handleDownload(job.jobId, job.outputFile!.filename)}
                                            className="btn btn-primary flex items-center space-x-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            <span>Download</span>
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
