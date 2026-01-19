'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/FileUpload';
import ProgressIndicator from '@/components/ProgressIndicator';
import DownloadButton from '@/components/DownloadButton';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import type { JobStatus } from '@/types';

import Breadcrumbs from '@/components/Breadcrumbs';
import AuthorCard from '@/components/AuthorCard';
import { AUTHORS } from '@/lib/authors';

export default function ImageToPDFPage() {
    const router = useRouter();
    const [files, setFiles] = useState<File[]>([]);
    const [jobId, setJobId] = useState<string | null>(null);
    const [status, setStatus] = useState<JobStatus>('pending');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleConvert = async () => {
        if (files.length < 1) {
            setError('Please select at least one image file');
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
            const job = await api.processTool('image-to-pdf', fileIds);

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
                        setError(jobData.error || 'Conversion failed');
                    }
                } catch (err) {
                    console.error('Polling error:', err);
                }
            }, 2000);

            setTimeout(() => clearInterval(pollInterval), 5 * 60 * 1000);
        } catch (err: any) {
            setStatus('failed');
            setError(err.message || 'Failed to convert images');
        }
    };

    const handleDownload = async () => {
        if (!jobId) return;

        try {
            const blob = await api.downloadResult(jobId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'converted.pdf';
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
                <Breadcrumbs items={[{ label: 'Image to PDF', href: '/image-to-pdf' }]} />
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="text-6xl mb-4">🖼️</div>
                    <h1 className="text-4xl font-bold mb-4">Image to PDF</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Convert JPG and PNG images to a professional PDF document
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
                            acceptedFileTypes={['.jpg', '.jpeg', '.png']}
                            maxFiles={50}
                            multiple={true}
                        />

                        {files.length >= 1 && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={handleConvert}
                                    className="btn btn-primary text-lg px-12 py-4"
                                >
                                    Convert {files.length} Image{files.length > 1 ? 's' : ''} to PDF
                                </button>
                            </div>
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
                                    ? 'Converting your images...'
                                    : status === 'completed'
                                        ? 'Your images have been converted to PDF successfully!'
                                        : status === 'failed'
                                            ? error || 'An error occurred'
                                            : 'Preparing your files...'
                            }
                        />

                        {status === 'completed' && (
                            <div className="mt-6 text-center">
                                <DownloadButton
                                    onClick={handleDownload}
                                    filename="converted.pdf"
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
                {/* High Depth SEO Content */}
                <div className="mt-20 space-y-16">
                    {/* How to Section (Featured Snippet) */}
                    <section>
                        <h2 className="text-3xl font-bold mb-6">How to Convert Images to PDF with Maximum Quality</h2>
                        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                            <p>
                                Digitizing your physical documents or converting graphic designs into professional PDF files is effortless with Docify. Our image conversion engine supports JPG, JPEG, and PNG formats, ensuring that color accuracy and resolution are preserved during the transition to PDF.
                            </p>
                            <div className="grid md:grid-cols-2 gap-8 my-8">
                                <div className="card p-6 border-l-4 border-blue-500">
                                    <h4 className="font-bold mb-2">Technical Image Handling:</h4>
                                    <ul className="text-sm space-y-2">
                                        <li><strong>DPI Preservation:</strong> High-resolution images are converted without losing detail.</li>
                                        <li><strong>Batch conversion:</strong> Combine up to 50 images into a single PDF document in one go.</li>
                                        <li><strong>Cross-Format Support:</strong> Mix JPG and PNG files into the same output PDF seamlessly.</li>
                                    </ul>
                                </div>
                                <div className="card p-6 border-l-4 border-indigo-500">
                                    <h4 className="font-bold mb-2">Quick 3-Step Guide:</h4>
                                    <ol className="text-sm space-y-2">
                                        <li>Upload your images (JPG or PNG) to our secure converter above.</li>
                                        <li>Choose to convert each image to a separate PDF or combine them into one.</li>
                                        <li>Download your high-quality PDF instantly.</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Use Cases Section */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Common Uses for Image-to-PDF Conversion</h2>
                        <div className="grid sm:grid-cols-3 gap-6">
                            <div className="p-4 border dark:border-gray-800 rounded-xl">
                                <h4 className="font-bold mb-2 text-blue-600">Scan Digitization</h4>
                                <p className="text-xs text-gray-500">Convert photos of physical documents or whiteboard notes into searchable, archivable PDF files.</p>
                            </div>
                            <div className="p-4 border dark:border-gray-800 rounded-xl">
                                <h4 className="font-bold mb-2 text-blue-600">Portfolio Creation</h4>
                                <p className="text-xs text-gray-500">Combine multiple design screenshots or mockups into a single professional presentation.</p>
                            </div>
                            <div className="p-4 border dark:border-gray-800 rounded-xl">
                                <h4 className="font-bold mb-2 text-blue-600">Easy Sharing</h4>
                                <p className="text-xs text-gray-500">PDF is universal. Convert multiple photos to one PDF so they are easily viewable on any device.</p>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section>
                        <h2 className="text-3xl font-bold mb-8 text-center">Image to PDF FAQ</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    q: "Can I combine different image formats?",
                                    a: "Yes! You can upload a mix of JPG, JPEG, and PNG files and we will merge them into a single, cohesive PDF document."
                                },
                                {
                                    q: "Is there a limit on the number of images?",
                                    a: "You can upload up to 50 images per conversion. This is perfect for long reports or multi-page scanned documents."
                                },
                                {
                                    q: "Will my images be compressed?",
                                    a: "We perform minimal compression to ensure your PDF is web-friendly while maintaining the full visual detail of your original photos."
                                },
                                {
                                    q: "Is my privacy protected?",
                                    a: "Absolutely. All image processing happens over secure HTTPS and files are automatically deleted after 30 minutes."
                                }
                            ].map((faq, i) => (
                                <div key={i} className="card p-6">
                                    <h4 className="font-bold mb-2">{faq.q}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="mt-20 border-t pt-12">
                    <h3 className="text-xl font-bold mb-6 text-center">About the Author</h3>
                    <AuthorCard author={AUTHORS['pdf-specialist']} />
                </div>
            </div>
        </div>
    );
}
