import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const interClassName = "font-sans"; // Fallback to system fonts

export const metadata: Metadata = {
    title: "Docify - Professional PDF Tools Online",
    description: "Free online PDF tools - merge, split, compress, convert, edit PDFs and more. Fast, secure, and easy to use.",
    keywords: "PDF, merge PDF, split PDF, compress PDF, convert PDF, edit PDF, online PDF tools",
    authors: [{ name: "Docify" }],
    robots: "index, follow",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${interClassName} antialiased`}>
                <Providers>
                    <div className="flex flex-col min-h-screen">
                        <Navigation />
                        <main className="flex-grow">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
