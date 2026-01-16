import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import { logger } from '../../utils/logger';

export async function mergePDFs(inputPaths: string[], outputPath: string): Promise<void> {
    try {
        logger.info(`Merging ${inputPaths.length} PDFs`);

        // Create a new PDF document
        const mergedPdf = await PDFDocument.create();

        // Loop through each input PDF
        for (const inputPath of inputPaths) {
            const pdfBytes = await fs.readFile(inputPath);
            const pdf = await PDFDocument.load(pdfBytes);

            // Copy all pages
            const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            pages.forEach((page) => mergedPdf.addPage(page));

            logger.debug(`Added ${pages.length} pages from ${inputPath}`);
        }

        // Save the merged PDF
        const mergedPdfBytes = await mergedPdf.save();
        await fs.writeFile(outputPath, mergedPdfBytes);

        logger.info(`PDF merge completed: ${outputPath}`);
    } catch (error) {
        logger.error('PDF merge error:', error);
        throw new Error(`Failed to merge PDFs: ${(error as Error).message}`);
    }
}
