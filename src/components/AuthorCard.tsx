import Image from 'next/image';
import { Author } from '@/lib/authors';
import { CheckCircle } from 'lucide-react';

interface AuthorCardProps {
    author: Author;
}

export default function AuthorCard({ author }: AuthorCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm mt-12">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-100 dark:border-indigo-900 shadow-lg">
                        <img
                            src={author.image}
                            alt={author.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                        <h4 className="text-xl font-bold">{author.name}</h4>
                        <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-50" />
                    </div>
                    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-3">{author.role}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto md:mx-0">
                        {author.bio}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start text-[10px] font-bold tracking-wider uppercase">
                        {author.expertise.map((exp) => (
                            <span key={exp} className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-gray-500">
                                {exp}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
