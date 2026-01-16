import { exec } from 'child_process';
import { promisify } from 'util';
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

        // Ghostscript quality settings
        const qualitySettings = {
            low: '/screen', // 72 dpi
            medium: '/ebook', // 150 dpi
            high: '/printer', // 300 dpi
        };

        const dpi = qualitySettings[quality];

        const command = `${config.GHOSTSCRIPT_PATH} -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=${dpi} -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;

        const { stderr } = await execAsync(command);

        if (stderr && !stderr.includes('GPL Ghostscript')) {
            logger.warn('Ghostscript warning:', stderr);
        }

        logger.info(`PDF compression completed: ${outputPath}`);
    } catch (error) {
        logger.error('PDF compression error:', error);
        throw new Error(`Failed to compress PDF: ${(error as Error).message}`);
    }
}
