import { Shield, Lock, Trash2, EyeOff, Server, HardDrive } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import AuthorCard from "@/components/AuthorCard";
import { AUTHORS } from "@/lib/authors";

export const metadata = {
    title: "Security & Privacy - Your Data is Safe with Docify",
    description: "Learn how Docify protects your documents with 256-bit encryption, automatic file deletion, and privacy-first protocols.",
};

export default function SecurityPage() {
    return (
        <div className="container-main py-20">
            <div className="max-w-4xl mx-auto">
                <Breadcrumbs items={[{ label: "Security & Privacy", href: "/security" }]} />
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Your Security is Our Priority
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        At Docify, we believe your documents should remain private. That's why we've built a security infrastructure that rivals enterprise-grade solutions.
                    </p>
                </div>

                <div className="grid md:grid-grid-cols-2 gap-8 mb-20">
                    <div className="card p-8 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900">
                        <Shield className="w-12 h-12 text-blue-600 mb-6" />
                        <h2 className="text-2xl font-bold mb-4">256-Bit SSL Encryption</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            All file transfers occur over a secure, encrypted HTTPS tunnel. We use 256-bit SSL encryption to ensure that your data cannot be intercepted by third parties during transit.
                        </p>
                    </div>

                    <div className="card p-8 bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900">
                        <Trash2 className="w-12 h-12 text-green-600 mb-6" />
                        <h2 className="text-2xl font-bold mb-4">Automatic File Deletion</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            We don't keep your files. Your documents are automatically and permanently deleted from our servers 30 minutes after processing. No backups, no traces.
                        </p>
                    </div>

                    <div className="card p-8 bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900">
                        <EyeOff className="w-12 h-12 text-purple-600 mb-6" />
                        <h2 className="text-2xl font-bold mb-4">No Human Inspection</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Our process is 100% automated. No employee or third party ever views your documents. The files are processed by our code and then immediately queued for deletion.
                        </p>
                    </div>

                    <div className="card p-8 bg-orange-50/50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900">
                        <Lock className="w-12 h-12 text-orange-600 mb-6" />
                        <h2 className="text-2xl font-bold mb-4">Privacy Compliance</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Docify is designed with GDPR and CCPA principles in mind. We minimize data collection and give you full control over your document lifecycle.
                        </p>
                    </div>
                </div>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <Server className="w-8 h-8 text-blue-600" />
                            How We Process Your Files
                        </h2>
                        <div className="prose dark:prose-invert max-w-none">
                            <p>
                                When you upload a file to Docify, it is stored in a temporary, sandboxed environment on our encrypted servers. Our server-side processing engine (Node.js) performs the requested operation—such as merging, splitting, or converting—and creates an output file.
                            </p>
                            <p>
                                Once the processing is complete, you are provided with a secure download link. This link remains active for 30 minutes. After this time, a scheduled internal cron job triggers a permanent wipe of both the input and output files from our physical disks.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <HardDrive className="w-8 h-8 text-indigo-600" />
                            Infrastructure & Hosting
                        </h2>
                        <div className="prose dark:prose-invert max-w-none">
                            <p>
                                We partner with world-class cloud providers (AWS/Vercel) to ensure that our servers are physically secure and have 99.9% uptime. Our infrastructure is regularly audited for security vulnerabilities, ensuring that our software stack remains hardened against modern threats.
                            </p>
                        </div>
                    </section>
                </div>

                <div className="mt-20 border-t pt-12">
                    <h3 className="text-xl font-bold mb-6 text-center">Verified by Experts</h3>
                    <AuthorCard author={AUTHORS['security-expert']} />
                </div>
            </div>
        </div>
    );
}
