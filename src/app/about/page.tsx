import { Users, Code2, Globe, Heart, ShieldCheck, Zap } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
    title: "About Us - The Mission Behind Docify",
    description: "Discover the story of Docify. We're on a mission to democratize document processing with free, fast, and secure online tools for everyone.",
};

export default function AboutPage() {
    return (
        <div className="container-main py-20">
            <div className="max-w-4xl mx-auto">
                <Breadcrumbs items={[{ label: "About Us", href: "/about" }]} />
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Our Mission: Simplify Documents
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Docify was born from a simple frustration: document tools should be accessible, high-quality, and free of annoying paywalls or intrusive ads.
                    </p>
                </div>

                <div className="prose dark:prose-invert max-w-none mb-20 text-lg leading-relaxed">
                    <p>
                        Since our inception in 2024, the team at Docify has been dedicated to building the world's most intuitive and secure document processing platform. What started as a simple PDF merger has evolved into a universal conversion platform supporting over 100+ file formats.
                    </p>
                    <p>
                        We believe that productivity tools are essential infrastructure for the modern web. Whether you're a student compressing a thesis, a lawyer merging contracts, or a developer converting data formats—Docify is designed to be your reliable partner.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    <div className="text-center p-6 card">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Privacy First</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            We never store your data. Period. Files are wiped automatically.
                        </p>
                    </div>

                    <div className="text-center p-6 card">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Zap className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Blazing Fast</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Our Node.js engine is optimized for high-performance processing.
                        </p>
                    </div>

                    <div className="text-center p-6 card">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Globe className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Always Free</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            No premium tiers, no hidden limits. Just great tools for everyone.
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-12 text-white text-center shadow-2xl">
                    <Heart className="w-16 h-16 mx-auto mb-6 text-pink-300 animate-pulse" />
                    <h2 className="text-3xl font-bold mb-4">Built by Experts, for Everyone</h2>
                    <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
                        Our engineering team consists of dedicated software architects and security specialists who believe in the power of open, efficient, and user-centric software.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium">Node.js Experts</span>
                        <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium">Next.js Specialists</span>
                        <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium">Security Architects</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
