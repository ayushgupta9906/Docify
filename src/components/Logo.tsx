'use client';

import { motion } from 'framer-motion';

export default function Logo() {
    return (
        <div className="flex items-center space-x-2 group cursor-pointer">
            <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="relative w-10 h-10 flex items-center justify-center"
            >
                {/* Background Shape */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] rounded-xl blur-[2px] opacity-80 group-hover:opacity-100 transition-opacity" />

                {/* Main Icon Shape */}
                <div className="relative w-8 h-8 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                    >
                        <path
                            d="M7 18H17M7 14H17M7 10H13M7 6H11"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            className="text-[var(--primary)]"
                        />
                        <rect
                            x="3"
                            y="2"
                            width="18"
                            height="20"
                            rx="3"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-gray-400"
                        />
                    </svg>

                    {/* Animated Glint */}
                    <motion.div
                        animate={{
                            x: [-40, 40],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                    />
                </div>
            </motion.div>

            <div className="flex flex-col -space-y-1">
                <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                    DOCIFY
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                    Premium Tools
                </span>
            </div>
        </div>
    );
}
