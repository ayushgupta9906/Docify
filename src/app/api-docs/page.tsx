'use client';

import { motion } from 'framer-motion';
import { Code, Zap, Lock } from 'lucide-react';

export default function APIDocsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
            <div className="container-main max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="text-6xl mb-4">📚</div>
                    <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Integrate Docify PDF tools into your applications
                    </p>
                </motion.div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { icon: Code, title: 'RESTful API', desc: 'Simple HTTP endpoints' },
                        { icon: Zap, title: 'High Performance', desc: 'Fast processing' },
                        { icon: Lock, title: 'Secure', desc: 'API key authentication' },
                    ].map((feature, idx) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="card p-6 text-center"
                        >
                            <feature.icon className="w-12 h-12 mx-auto mb-4 text-[var(--primary)]" />
                            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Endpoints */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-8"
                >
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Base URL</h2>
                        <div className="card p-4 bg-gray-100 dark:bg-gray-800">
                            <code className="text-[var(--primary)]">https://api.docify.example.com</code>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. Upload Files</h2>
                        <div className="card p-6">
                            <div className="mb-4">
                                <span className="px-3 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold mr-2">
                                    POST
                                </span>
                                <code>/api/upload</code>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Upload one or more files for processing.
                            </p>

                            <h4 className="font-semibold mb-2">Request (multipart/form-data):</h4>
                            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm mb-4">
                                {`files: File[]  // Array of files to upload`}
                            </pre>

                            <h4 className="font-semibold mb-2">Response:</h4>
                            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                                {`{
  "success": true,
  "data": [{
    "fileId": "abc123",
    "filename": "document.pdf",
    "size": 1024000,
    "mimeType": "application/pdf"
  }]
}`}
                            </pre>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. Process Files</h2>
                        <div className="card p-6">
                            <div className="mb-4">
                                <span className="px-3 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold mr-2">
                                    POST
                                </span>
                                <code>/api/process/:tool</code>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Process uploaded files with the specified tool.
                            </p>

                            <h4 className="font-semibold mb-2">Available Tools:</h4>
                            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                                {[
                                    'merge', 'split', 'compress', 'rotate',
                                    'pdf-to-word', 'word-to-pdf', 'pdf-to-ppt', 'ppt-to-pdf',
                                    'pdf-to-excel', 'excel-to-pdf', 'image-to-pdf', 'pdf-to-jpg',
                                    'protect', 'unlock', 'watermark', 'page-numbers',
                                    'reorder', 'delete-pages', 'repair', 'ocr'
                                ].map((tool) => (
                                    <code key={tool} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                                        {tool}
                                    </code>
                                ))}
                            </div>

                            <h4 className="font-semibold mb-2">Request (JSON):</h4>
                            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm mb-4">
                                {`{
  "fileIds": ["abc123", "def456"],
  "options": {
    "quality": "medium"  // Tool-specific options
  }
}`}
                            </pre>

                            <h4 className="font-semibold mb-2">Response:</h4>
                            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                                {`{
  "success": true,
  "data": {
    "jobId": "job-789",
    "status": "pending"
  }
}`}
                            </pre>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. Get Job Status</h2>
                        <div className="card p-6">
                            <div className="mb-4">
                                <span className="px-3 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold mr-2">
                                    GET
                                </span>
                                <code>/api/jobs/:jobId</code>
                            </div>

                            <h4 className="font-semibold mb-2">Response:</h4>
                            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                                {`{
  "success": true,
  "data": {
    "jobId": "job-789",
    "status": "completed",  // pending, processing, completed, failed
    "progress": 100,
    "downloadUrl": "/api/jobs/job-789/download"
  }
}`}
                            </pre>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. Download Result</h2>
                        <div className="card p-6">
                            <div className="mb-4">
                                <span className="px-3 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold mr-2">
                                    GET
                                </span>
                                <code>/api/jobs/:jobId/download</code>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400">
                                Returns the processed file as a binary stream.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Example: Merge PDFs</h2>
                        <div className="card p-6">
                            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                                {`// 1. Upload files
const formData = new FormData();
formData.append('files', file1);
formData.append('files', file2);

const uploadRes = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});
const { data: files } = await uploadRes.json();

// 2. Start merge job
const processRes = await fetch('/api/process/merge', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fileIds: files.map(f => f.fileId)
  })
});
const { data: job } = await processRes.json();

// 3. Poll for completion
const pollInterval = setInterval(async () => {
  const statusRes = await fetch(\`/api/jobs/\${job.jobId}\`);
  const { data } = await statusRes.json();
  
  if (data.status === 'completed') {
    clearInterval(pollInterval);
    window.location.href = data.downloadUrl;
  }
}, 2000);`}
                            </pre>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
                        <div className="card p-6">
                            <p className="text-gray-600 dark:text-gray-400">
                                • 100 requests per 15 minutes per IP<br />
                                • Maximum file size: 100MB<br />
                                • Files auto-delete after 30 minutes
                            </p>
                        </div>
                    </section>
                </motion.div>
            </div>
        </div>
    );
}
