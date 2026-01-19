'use client';
import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ProgressIndicator from '@/components/ProgressIndicator';
import { api } from '@/lib/api';
import { TOOLS } from '@/lib/tools';
import { motion } from 'framer-motion';
import type { JobStatus } from '@/types';

interface FileProgress {
    filename: string;
    status: JobStatus;
    progress: number;
    jobId: string | null;
    error?: string;
}

export default function BulkPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [selectedTool, setSelectedTool] = useState('');
    const [fileProgress, setFileProgress] = useState<FileProgress[]>([]);
    const [processing, setProcessing] = useState(false);

    const handleBulkProcess = async () => {
        if (!files.length || !selectedTool) return;
        setProcessing(true);
        const progressMap: FileProgress[] = files.map(f => ({ filename: f.name, status: 'pending', progress: 0, jobId: null }));
        setFileProgress(progressMap);

        for (let i = 0; i < files.length; i++) {
            try {
                progressMap[i].status = 'processing';
                progressMap[i].progress = 20;
                setFileProgress([...progressMap]);
                const uploaded = await api.uploadFiles([files[i]]);
                progressMap[i].progress = 50;
                setFileProgress([...progressMap]);
                const job = await api.processTool(selectedTool, uploaded.map(f => f.fileId), {});
                progressMap[i].jobId = job.jobId;
                const result = await pollJob(job.jobId);
                progressMap[i].status = result.status;
                progressMap[i].progress = result.status === 'completed' ? 100 : progressMap[i].progress;
                progressMap[i].error = result.error;
                setFileProgress([...progressMap]);
            } catch (error: any) {
                progressMap[i].status = 'failed';
                progressMap[i].error = error.message;
                setFileProgress([...progressMap]);
            }
        }
        setProcessing(false);
    };

    const pollJob = (jobId: string): Promise<{ status: JobStatus; error?: string }> => {
        return new Promise((resolve) => {
            const interval = setInterval(async () => {
                try {
                    const data = await api.getJobStatus(jobId);
                    if (data.status === 'completed') { clearInterval(interval); resolve({ status: 'completed' }); }
                    else if (data.status === 'failed') { clearInterval(interval); resolve({ status: 'failed', error: data.error }); }
                } catch { clearInterval(interval); resolve({ status: 'failed', error: 'Status check failed' }); }
            }, 2000);
            setTimeout(() => { clearInterval(interval); resolve({ status: 'failed', error: 'Timeout' }); }, 300000);
        });
    };

    const download = async (jobId: string, name: string) => {
        try {
            const blob = await api.downloadResult(jobId);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = name.replace(/\.\w+$/, '_processed.pdf');
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h1 className="text-4xl font-bold mb-4">Bulk Conversion</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Process multiple files at once</p>
                </motion.div>

                {!processing && !fileProgress.length && (
                    <div>
                        <FileUpload onFilesSelected={setFiles} acceptedFileTypes={['.pdf', '.docx', '.jpg', '.jpeg', '.png']} maxFiles={10} multiple={true} />
                        {files.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-2xl font-bold text-center mb-6">Select a Service</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                    {TOOLS.map((tool) => (
                                        <motion.button
                                            key={tool.id}
                                            onClick={() => setSelectedTool(tool.id)}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            whileHover={{ scale: 1.05 }}
                                            className={`card p-6 text-left transition-all cursor-pointer ${selectedTool === tool.id
                                                    ? 'ring-4 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'hover:shadow-lg'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="text-4xl">{tool.icon}</div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg mb-1">{tool.title}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
                                                </div>
                                                {selectedTool === tool.id && (
                                                    <div className="text-2xl">✓</div>
                                                )}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                                {selectedTool && (
                                    <div className="text-center">
                                        <button onClick={handleBulkProcess} className="btn btn-primary text-lg px-12 py-4">
                                            {TOOLS.find(t => t.id === selectedTool)?.icon} Process {files.length} Files with {TOOLS.find(t => t.id === selectedTool)?.title}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {fileProgress.length > 0 && (
                    <div className="space-y-4">
                        {fileProgress.map((f, i) => (
                            <div key={i} className="card p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{f.status === 'completed' ? '✅' : f.status === 'failed' ? '❌' : '⏳'}</span>
                                        <div>
                                            <p className="font-medium">{f.filename}</p>
                                            {f.error && <p className="text-sm text-red-500">{f.error}</p>}
                                        </div>
                                    </div>
                                    {f.status === 'completed' && f.jobId && (
                                        <button onClick={() => download(f.jobId!, f.filename)} className="btn btn-sm btn-primary">
                                            Download
                                        </button>
                                    )}
                                </div>
                                <ProgressIndicator status={f.status} progress={f.progress} message="" />
                            </div>
                        ))}
                        {!processing && (
                            <div className="text-center mt-6">
                                <button onClick={() => { setFileProgress([]); setFiles([]); setSelectedTool(''); }} className="btn btn-outline px-8 py-3">
                                    Process More Files
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
