'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin/login');
            return;
        }

        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                if (data.success) setStats(data.data);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, [router]);

    if (!stats) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <div className="text-6xl mb-4">⏳</div>
                <p className="text-xl">Loading dashboard...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl font-bold mb-2">📊 Admin Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">Docify Analytics & Monitoring</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-sm font-semibold uppercase opacity-90 mb-2">Total Jobs</h3>
                            <p className="text-4xl font-bold">{stats.totalJobs}</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-sm font-semibold uppercase opacity-90 mb-2">Completed</h3>
                            <p className="text-4xl font-bold">{stats.completed}</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-sm font-semibold uppercase opacity-90 mb-2">Failed</h3>
                            <p className="text-4xl font-bold">{stats.failed}</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
                        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-sm font-semibold uppercase opacity-90 mb-2">Processing</h3>
                            <p className="text-4xl font-bold">{stats.processing}</p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">Jobs by Service</h2>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {stats.byTool.map((t: any, i: number) => (
                                    <div key={t._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:scale-105 transition-transform">
                                        <span className="font-medium capitalize">{t._id || 'Unknown'}</span>
                                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{t.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">Success Rate</h2>
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <div className="text-6xl font-bold mb-4">
                                        {stats.totalJobs > 0 ? Math.round((stats.completed / stats.totalJobs) * 100) : 0}%
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {stats.completed} of {stats.totalJobs} jobs successful
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-3 px-4 font-semibold">Service</th>
                                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold">Files</th>
                                        <th className="text-left py-3 px-4 font-semibold">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recent.map((j: any) => (
                                        <tr key={j._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="py-3 px-4 capitalize">{j.tool}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${j.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                        j.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}>
                                                    {j.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">{j.inputFiles?.length || 0}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(j.createdAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
