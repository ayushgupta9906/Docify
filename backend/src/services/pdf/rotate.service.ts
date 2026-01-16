import { PDFDocument, degrees } from 'pdf-lib';
import fs from 'fs/promises';
import { logger } from '../../utils/logger';

export async function rotatePDF(
    inputPath: string,
    outputPath: string,
    rotation: 90 | 180 | 270,
    pages?: number[]
): Promise<void> {
    try {
        logger.info(`Rotating PDF by ${rotation} degrees`);

        const pdfBytes = await fs.readFile(inputPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const totalPages = pdfDoc.getPageCount();

        // Determine which pages to rotate
        const pagesToRotate = pages && pages.length > 0
            ? pages.filter((p) => p > 0 && p <= totalPages).map((p) => p - 1)
            : Array.from({ length: totalPages }, (_, i) => i);

        // Rotate pages
        for (const pageIndex of pagesToRotate) {
            const page = pdfDoc.getPage(pageIndex);
            page.setRotation(degrees(rotation));
        }

        // Save rotated PDF
        const rotatedPdfBytes = await pdfDoc.save();
        await fs.writeFile(outputPath, rotatedPdfBytes);

        logger.info(`PDF rotation completed: ${outputPath}`);
    } catch (error) {
        logger.error('PDF rotation error:', error);
        throw new Error(`Failed to rotate PDF: ${(error as Error).message}`);
    }
}
