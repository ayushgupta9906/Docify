'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, History, BookOpen, Sparkles } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import Logo from './Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Navigation() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/history', label: 'History', icon: History },
        { href: '/api-docs', label: 'API Docs', icon: BookOpen },
    ];

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 transition-all duration-300 pointer-events-none">
            <nav className={`
                w-full max-w-7xl h-16 glass rounded-2xl flex items-center justify-between px-6 pointer-events-auto
                transition-all duration-500 transform
                ${scrolled ? 'scale-[0.98] shadow-2xl translate-y-2' : ''}
            `}>
                {/* Logo Section */}
                <Link href="/">
                    <Logo />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`
                                relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300
                                flex items-center space-x-2 group
                                ${pathname === link.href
                                    ? 'text-[var(--primary)] bg-[var(--primary)]/10'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}
                            `}
                        >
                            <link.icon className="w-4 h-4" />
                            <span>{link.label}</span>
                            {pathname === link.href && (
                                <motion.div
                                    layoutId="nav-active"
                                    className="absolute bottom-1 left-4 right-4 h-0.5 bg-[var(--primary)] rounded-full"
                                />
                            )}
                        </Link>
                    ))}

                    <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-4" />

                    <DarkModeToggle />

                    <Link
                        href="/merge"
                        className="ml-4 btn btn-primary !py-2 !px-4 text-sm flex items-center space-x-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Get Started</span>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center space-x-3">
                    <DarkModeToggle />
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-xl h-10 w-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mobileMenuOpen ? 'close' : 'menu'}
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 90 }}
                                transition={{ duration: 0.2 }}
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </motion.div>
                        </AnimatePresence>
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="absolute top-20 left-4 right-4 glass rounded-2xl p-4 md:hidden shadow-2xl"
                        >
                            <div className="flex flex-col space-y-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`
                                            flex items-center space-x-3 p-4 rounded-xl transition-colors
                                            ${pathname === link.href
                                                ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                                                : 'hover:bg-gray-100 dark:hover:bg-white/5'}
                                        `}
                                    >
                                        <link.icon className="w-5 h-5" />
                                        <span className="font-bold">{link.label}</span>
                                    </Link>
                                ))}
                                <Link
                                    href="/merge"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center space-x-2 p-4 rounded-xl bg-[var(--primary)] text-white font-bold"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    <span>Get Started</span>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </div>
    );
}

