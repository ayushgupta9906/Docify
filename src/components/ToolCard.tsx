import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ToolCardData } from '@/types';
import { cn } from '@/lib/utils';

interface ToolCardProps {
    tool: ToolCardData;
    index: number;
}

export default function ToolCard({ tool, index }: ToolCardProps) {
    const colorClasses = {
        blue: 'hover:border-blue-500 hover:shadow-blue-500/20',
        purple: 'hover:border-purple-500 hover:shadow-purple-500/20',
        green: 'hover:border-green-500 hover:shadow-green-500/20',
        orange: 'hover:border-orange-500 hover:shadow-orange-500/20',
        indigo: 'hover:border-indigo-500 hover:shadow-indigo-500/20',
    };

    return (
        <Link href={tool.href}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                    'card p-6 cursor-pointer transition-all duration-300 border-2 border-transparent',
                    colorClasses[tool.color as keyof typeof colorClasses]
                )}
            >
                <div className="flex flex-col items-center text-center space-y-3">
                    {/* Icon */}
                    <div className="text-5xl mb-2">{tool.icon}</div>

                    {/* Title */}
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {tool.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {tool.description}
                    </p>
                </div>
            </motion.div>
        </Link>
    );
}
