'use client';

import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface DownloadButtonProps {
    onClick: () => void;
    disabled?: boolean;
    filename?: string;
}

export default function DownloadButton({
    onClick,
    disabled = false,
    filename,
}: DownloadButtonProps) {
    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            onClick={onClick}
            disabled={disabled}
            className="btn btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
        >
            <Download className="w-5 h-5" />
            <span>Download {filename ? filename : 'Result'}</span>
        </motion.button>
    );
}
