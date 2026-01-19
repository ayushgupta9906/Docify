import { exec } from 'child_process';
import { promisify } from 'util';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import config from '../../config';
import { logger } from '../../utils/logger';

const execAsync = promisify(exec);

export async function compressPDF(
    inputPath: string,
    outputPath: string,
    quality: 'low' | 'medium' | 'high' = 'medium'
): Promise<void> {
    try {
        logger.info(`Compressing PDF with ${quality} quality`);

        try {
            // Ghostscript quality settings
            const qualitySettings = {
                low: '/screen', // 72 dpi
                medium: '/ebook', // 150 dpi
                high: '/printer', // 300 dpi
            };

            const dpi = qualitySettings[quality];

            const command = `${config.GHOSTSCRIPT_PATH} -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=${dpi} -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;

            await execAsync(command);
            logger.info(`PDF compression (Ghostscript) completed: ${outputPath}`);
            return;
        } catch (gsError) {
            logger.warn('Ghostscript compression failed, falling back to pdf-lib optimization:', gsError);

            // Fallback: Use pdf-lib to re-save the document (minimal optimization)
            const pdfBytes = await fs.readFile(inputPath);
            const pdfDoc = await PDFDocument.load(pdfBytes);

            // pdf-lib doesn't have true "compression" but re-saving can sometimes reduce size
            const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: true });
            await fs.writeFile(outputPath, compressedPdfBytes);

            logger.info(`PDF optimization (pdf-lib fallback) completed: ${outputPath}`);
        }
    } catch (error) {
        logger.error('PDF compression/optimization error:', error);
        throw new Error(`Failed to processing PDF: ${(error as Error).message}`);
    }
}
