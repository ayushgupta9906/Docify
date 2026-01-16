'use client';

import { TOOLS, TOOL_CATEGORIES } from '@/lib/tools';
import ToolCard from '@/components/ToolCard';
import { Search, Zap, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTools = TOOLS.filter((tool) =>
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toolsByCategory = Object.entries(TOOL_CATEGORIES).map(([key, categoryData]) => ({
        key,
        ...categoryData,
        tools: filteredTools.filter((tool) => tool.category === key),
    }));

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="container-main text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] bg-clip-text text-transparent"
                    >
                        Every tool you need to work with PDFs
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
                    >
                        Free, fast, and secure online PDF tools. No installation required.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto mb-16"
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for a tool..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-[var(--border)] focus:border-[var(--primary)] focus:outline-none text-lg bg-white dark:bg-[var(--muted)] transition-colors"
                            />
                        </div>
                    </motion.div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 max-w-4xl mx-auto">
                        {[
                            { icon: Zap, title: 'Lightning Fast', desc: 'Process files in seconds' },
                            { icon: Shield, title: 'Secure & Private', desc: 'Files auto-delete after 30 minutes' },
                            { icon: Clock, title: '24/7 Available', desc: 'Access anytime, anywhere' },
                        ].map((feature, idx) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                className="flex flex-col items-center text-center p-6"
                            >
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center mb-4">
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tools Grid */}
            <section className="py-12 px-4">
                <div className="container-main">
                    {toolsByCategory.map((category) => {
                        if (category.tools.length === 0) return null;

                        return (
                            <div key={category.key} className="mb-16">
                                <h2 className="text-3xl font-bold mb-8 flex items-center">
                                    <span className={`bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                                        {category.name}
                                    </span>
                                    <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                                        ({category.tools.length})
                                    </span>
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {category.tools.map((tool, index) => (
                                        <ToolCard key={tool.id} tool={tool} index={index} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {filteredTools.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                No tools found matching &quot;{searchQuery}&quot;
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
                <div className="container-main text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Choose a tool above and start processing your PDFs now
                    </p>
                </div>
            </section>
        </div>
    );
}
