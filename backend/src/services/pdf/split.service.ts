import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import archiver from 'archiver';
import { logger } from '../../utils/logger';
import { createWriteStream } from 'fs';

export async function splitPDF(
    inputPath: string,
    outputPath: string,
    options: any = {}
): Promise<void> {
    try {
        logger.info(`Splitting PDF: ${inputPath}`);

        const pdfBytes = await fs.readFile(inputPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const totalPages = pdfDoc.getPageCount();

        const splitFiles: string[] = [];

        if (options.splitType === 'fixed' && options.pagesPerFile) {
            // Split into fixed page chunks
            const pagesPerFile = options.pagesPerFile;
            let pageIndex = 0;

            while (pageIndex < totalPages) {
                const newPdf = await PDFDocument.create();
                const endIndex = Math.min(pageIndex + pagesPerFile, totalPages);

                for (let i = pageIndex; i < endIndex; i++) {
                    const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
                    newPdf.addPage(copiedPage);
                }

                const tempPath = outputPath.replace('.zip', `_part_${Math.floor(pageIndex / pagesPerFile) + 1}.pdf`);
                const bytes = await newPdf.save();
                await fs.writeFile(tempPath, bytes);
                splitFiles.push(tempPath);

                pageIndex = endIndex;
            }
        } else if (options.splitType === 'range' && options.ranges) {
            // Split by page ranges: "1-3,5,7-9"
            const ranges = options.ranges.split(',').map((r: string) => r.trim());

            for (let i = 0; i < ranges.length; i++) {
                const range = ranges[i];
                const newPdf = await PDFDocument.create();

                if (range.includes('-')) {
                    const [start, end] = range.split('-').map(Number);
                    for (let pageNum = start - 1; pageNum < end && pageNum < totalPages; pageNum++) {
                        const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNum]);
                        newPdf.addPage(copiedPage);
                    }
                } else {
                    const pageNum = Number(range) - 1;
                    if (pageNum >= 0 && pageNum < totalPages) {
                        const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNum]);
                        newPdf.addPage(copiedPage);
                    }
                }

                const tempPath = outputPath.replace('.zip', `_range_${i + 1}.pdf`);
                const bytes = await newPdf.save();
                await fs.writeFile(tempPath, bytes);
                splitFiles.push(tempPath);
            }
        } else {
            // Default: split each page into separate file
            for (let i = 0; i < totalPages; i++) {
                const newPdf = await PDFDocument.create();
                const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
                newPdf.addPage(copiedPage);

                const tempPath = outputPath.replace('.zip', `_page_${i + 1}.pdf`);
                const bytes = await newPdf.save();
                await fs.writeFile(tempPath, bytes);
                splitFiles.push(tempPath);
            }
        }

        // Create ZIP archive
        await createZipArchive(splitFiles, outputPath);

        // Clean up individual files
        for (const file of splitFiles) {
            await fs.unlink(file);
        }

        logger.info(`PDF split completed: ${splitFiles.length} files created`);
    } catch (error) {
        logger.error('PDF split error:', error);
        throw new Error(`Failed to split PDF: ${(error as Error).message}`);
    }
}

async function createZipArchive(files: string[], outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const output = createWriteStream(outputPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => resolve());
        archive.on('error', (err) => reject(err));

        archive.pipe(output);

        files.forEach((file) => {
            archive.file(file, { name: path.basename(file) });
        });

        archive.finalize();
    });
}
