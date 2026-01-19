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
                        Free Online PDF Tools - Edit, Convert & Merge PDFs
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
                    >
                        Professional PDF tools for free. Fast, secure, and easy to use. No signup required.
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

            {/* How it Works - Featured Snippet Target */}
            <section className="py-20 px-4">
                <div className="container-main max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center underline decoration-[var(--primary)] decoration-4 underline-offset-8">
                        How to Use Docify Tools in 3 Simple Steps
                    </h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                step: "01",
                                title: "Upload Files",
                                desc: "Select your PDF or document from your computer, Google Drive, or Dropbox. We support batches up to 10 files."
                            },
                            {
                                step: "02",
                                title: "Adjust Settings",
                                desc: "Customize your output. Reorder pages, choose compression levels, or select target languages for AI translation."
                            },
                            {
                                step: "03",
                                title: "Download Result",
                                desc: "Our high-speed engine processes your request in seconds. Download your file or share it instantly."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="relative group">
                                <div className="text-6xl font-black text-gray-100 dark:text-gray-800 mb-4 group-hover:text-[var(--primary)]/10 transition-colors">
                                    {item.step}
                                </div>
                                <div className="absolute top-10 left-0">
                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases - Long Tail Keyword Target */}
            <section className="py-20 px-4 bg-blue-50/30 dark:bg-blue-900/10">
                <div className="container-main">
                    <h2 className="text-3xl font-bold mb-16 text-center">Professional Document Solutions for Every Industry</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: "Legal & Compliance",
                                desc: "Merge contracts, redact sensitive info, and protect documents with 256-bit AES encryption for legal audits."
                            },
                            {
                                title: "Academic & Research",
                                desc: "Compress large theses for portal submissions and convert scanned research papers into searchable Word docs using AI OCR."
                            },
                            {
                                title: "Real Estate & Finance",
                                desc: "Extract data from bank statements into Excel and batch-convert property listings into high-quality PDFs."
                            },
                            {
                                title: "Developers & Tech",
                                desc: "Convert JSON to XML, YAML to JSON, and Markdown to HTML instantly using our developer-first API tools."
                            }
                        ].map((useCase, idx) => (
                            <div key={idx} className="card p-8 hover:bg-white dark:hover:bg-[var(--muted)] transition-all transform hover:-translate-y-1">
                                <h3 className="text-lg font-extrabold mb-4 text-[var(--primary)]">{useCase.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{useCase.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="container-main max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-8">
                        {[
                            {
                                q: "Is Docify really free to use?",
                                a: "Yes, all our tools are 100% free with no hidden charges or limits for standard use. You don't even need to create an account."
                            },
                            {
                                q: "Is my data secure?",
                                a: "Absolutely. We treat security seriously. All uploaded files are processed via HTTPS and are automatically deleted from our servers after 30 minutes."
                            },
                            {
                                q: "Do you keep a copy of my files?",
                                a: "No. We do not store, share, or analyze any of your data. Once the processing is complete and the file is deleted, it's gone forever."
                            },
                            {
                                q: "Can I use Docify on my mobile phone?",
                                a: "Yes! Docify is a progressive web app that works perfectly on smartphones, tablets, and desktops. No app installation required."
                            }
                        ].map((faq, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="card p-6"
                            >
                                <h3 className="text-xl font-bold mb-3">{faq.q}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
                <div className="container-main text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">Start Processing your PDFs Online</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Reliable, fast, and secure PDF tools for everyone. Choose a tool above to get started.
                    </p>
                </div>
            </section>
        </div>
    );
}
