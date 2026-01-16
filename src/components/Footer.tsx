'use client';

import Link from 'next/link';
import { Github, Twitter, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-[var(--muted)] border-t border-[var(--border)] mt-20">
            <div className="container-main py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Docify</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Professional PDF tools for everyone. Free, fast, and secure document processing.
                        </p>
                    </div>

                    {/* Tools */}
                    <div>
                        <h3 className="font-semibold text-sm mb-4 text-gray-700 dark:text-gray-300">Popular Tools</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/merge" className="text-gray-600 dark:text-gray-400 hover:text-[var(--primary)]">Merge PDF</Link></li>
                            <li><Link href="/split" className="text-gray-600 dark:text-gray-400 hover:text-[var(--primary)]">Split PDF</Link></li>
                            <li><Link href="/compress" className="text-gray-600 dark:text-gray-400 hover:text-[var(--primary)]">Compress PDF</Link></li>
                            <li><Link href="/convert" className="text-gray-600 dark:text-gray-400 hover:text-[var(--primary)]">Convert PDF</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-semibold text-sm mb-4 text-gray-700 dark:text-gray-300">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/api-docs" className="text-gray-600 dark:text-gray-400 hover:text-[var(--primary)]">API Documentation</Link></li>
                            <li><Link href="/history" className="text-gray-600 dark:text-gray-400 hover:text-[var(--primary)]">Processing History</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-semibold text-sm mb-4 text-gray-700 dark:text-gray-300">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[var(--primary)] transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[var(--primary)] transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[var(--border)] mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                    <p className="flex items-center justify-center space-x-1">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                        <span>by Docify Team · © {new Date().getFullYear()}</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
