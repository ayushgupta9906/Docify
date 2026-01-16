'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import type { JobStatus } from '@/types';

interface ProgressIndicatorProps {
    status: JobStatus;
    progress?: number;
    message?: string;
}

export default function ProgressIndicator({
    status,
    progress = 0,
    message,
}: ProgressIndicatorProps) {
    const [displayProgress, setDisplayProgress] = useState(0);

    useEffect(() => {
        // Smooth progress animation
        const timeout = setTimeout(() => {
            setDisplayProgress(progress);
        }, 100);
        return () => clearTimeout(timeout);
    }, [progress]);

    const statusConfig = {
        pending: {
            icon: Loader2,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            borderColor: 'border-blue-200 dark:border-blue-800',
            label: 'Pending',
        },
        processing: {
            icon: Loader2,
            color: 'text-[var(--primary)]',
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            borderColor: 'border-red-200 dark:border-red-800',
            label: 'Processing',
        },
        completed: {
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            borderColor: 'border-green-200 dark:border-green-800',
            label: 'Completed',
        },
        failed: {
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            borderColor: 'border-red-200 dark:border-red-800',
            label: 'Failed',
        },
    };

    const config = statusConfig[status];
    const Icon = config.icon;
    const isAnimating = status === 'pending' || status === 'processing';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl border ${config.bgColor} ${config.borderColor}`}
        >
            <div className="flex items-center space-x-4 mb-4">
                <Icon
                    className={`w-6 h-6 ${config.color} ${isAnimating ? 'animate-spin' : ''}`}
                />
                <div className="flex-1">
                    <h3 className={`font-semibold ${config.color}`}>{config.label}</h3>
                    {message && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {message}
                        </p>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            {(status === 'processing' || status === 'pending') && (
                <div>
                    <div className="progress-bar">
                        <motion.div
                            className="progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${displayProgress}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-right">
                        {Math.round(displayProgress)}%
                    </p>
                </div>
            )}
        </motion.div>
    );
}
