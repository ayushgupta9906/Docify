'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { formatFileSize, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
    onFilesSelected: (files: File[]) => void;
    acceptedFileTypes?: string[];
    maxFiles?: number;
    maxFileSize?: number;
    multiple?: boolean;
}

export default function FileUpload({
    onFilesSelected,
    acceptedFileTypes = ['.pdf'],
    maxFiles = 10,
    maxFileSize = 100 * 1024 * 1024, // 100MB
    multiple = true,
}: FileUploadProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: any[]) => {
            setError(null);

            if (rejectedFiles.length > 0) {
                const rejection = rejectedFiles[0];
                if (rejection.errors[0]?.code === 'file-too-large') {
                    setError(`File is too large. Maximum size is ${formatFileSize(maxFileSize)}`);
                } else if (rejection.errors[0]?.code === 'file-invalid-type') {
                    setError(`Invalid file type. Accepted: ${acceptedFileTypes.join(', ')}`);
                } else {
                    setError('File upload error. Please try again.');
                }
                return;
            }

            if (!multiple && acceptedFiles.length > 1) {
                setError('Only one file allowed');
                return;
            }

            if (selectedFiles.length + acceptedFiles.length > maxFiles) {
                setError(`Maximum ${maxFiles} files allowed`);
                return;
            }

            const newFiles = [...selectedFiles, ...acceptedFiles];
            setSelectedFiles(newFiles);
            onFilesSelected(newFiles);
        },
        [selectedFiles, maxFiles, maxFileSize, acceptedFileTypes, multiple, onFilesSelected]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptedFileTypes.reduce((acc, type) => {
            const t = type.toLowerCase();
            if (t === '.pdf') acc['application/pdf'] = ['.pdf'];
            else if (t === '.docx') acc['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] = ['.docx'];
            else if (t === '.pptx') acc['application/vnd.openxmlformats-officedocument.presentationml.presentation'] = ['.pptx'];
            else if (t === '.xlsx') acc['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] = ['.xlsx'];
            else if (t === '.jpg' || t === '.jpeg') acc['image/jpeg'] = ['.jpg', '.jpeg'];
            else if (t === '.png') acc['image/png'] = ['.png'];
            else if (t === '.webp') acc['image/webp'] = ['.webp'];
            else if (t === '.json') acc['application/json'] = ['.json'];
            else if (t === '.xml') acc['application/xml'] = ['.xml'];
            else if (t === '.csv') acc['text/csv'] = ['.csv'];
            else if (t === '.md' || t === '.markdown') acc['text/markdown'] = ['.md', '.markdown'];
            else if (t === '.yaml' || t === '.yml') acc['text/yaml'] = ['.yaml', '.yml'];
            else if (t === '.epub') acc['application/epub+zip'] = ['.epub'];
            else acc['application/octet-stream'] = [t]; // Fallback
            return acc;
        }, {} as Record<string, string[]>),
        maxSize: maxFileSize,
        multiple,
    });

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        onFilesSelected(newFiles);
        setError(null);
    };

    const clearAll = () => {
        setSelectedFiles([]);
        onFilesSelected([]);
        setError(null);
    };

    return (
        <div className="w-full">
            {/* Drop Zone */}
            <div
                {...getRootProps()}
                className={cn(
                    'drop-zone cursor-pointer',
                    isDragActive && 'active'
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center py-12">
                    <Upload className={cn(
                        'w-16 h-16 mb-4 transition-colors',
                        isDragActive ? 'text-[var(--primary)]' : 'text-gray-400'
                    )} />

                    {isDragActive ? (
                        <p className="text-lg font-semibold text-[var(--primary)]">
                            Drop files here...
                        </p>
                    ) : (
                        <>
                            <p className="text-lg font-semibold mb-2">
                                Drag & drop files here
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                or click to browse
                            </p>
                            <p className="text-xs text-gray-400">
                                Accepted: {acceptedFileTypes.join(', ')} · Max: {formatFileSize(maxFileSize)}
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">
                            Selected Files ({selectedFiles.length})
                        </h3>
                        <button
                            onClick={clearAll}
                            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="space-y-3">
                        <AnimatePresence>
                            {selectedFiles.map((file, index) => (
                                <motion.div
                                    key={`${file.name}-${index}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="card p-4 flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                        <div className="p-2 rounded-lg bg-[var(--primary)]/10">
                                            <File className="w-5 h-5 text-[var(--primary)]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{file.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0 ml-4"
                                    >
                                        <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}
