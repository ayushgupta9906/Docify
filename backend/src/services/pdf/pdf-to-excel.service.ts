import { logger } from '../../utils/logger';
import fs from 'fs/promises';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';

export async function pdfToExcel(
    inputPath: string,
    outputPath: string,
    onProgress?: (progress: number) => Promise<void>
): Promise<void> {
    try {
        logger.info(`Converting PDF to Excel (CSV): ${inputPath}`);

        const data = new Uint8Array(await fs.readFile(inputPath));

        // Use legacy build for Node.js compatibility if needed, 
        // though pdfjs-dist 4.0+ is ESM and might need special handling.
        const loadingTask = pdfjs.getDocument({
            data,
            useSystemFonts: true,
            disableFontFace: true,
            isEvalDisabled: true,
        });

        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;
        let csvContent = "Page,Text Content\n";

        for (let i = 1; i <= totalPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            // Basic heuristic: group by line
            const items = textContent.items as any[];
            let lastY = -1;
            let pageText = "";

            for (const item of items) {
                if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 5) {
                    pageText += " ";
                }
                pageText += item.str;
                lastY = item.transform[5];
            }

            // Escape CSV values
            const escapedText = `"${pageText.replace(/"/g, '""')}"`;
            csvContent += `${i},${escapedText}\n`;

            if (onProgress) {
                const progress = Math.round((i / totalPages) * 100);
                await onProgress(progress);
            }
        }

        await fs.writeFile(outputPath, csvContent);
        logger.info(`PDF to Excel conversion completed: ${outputPath}`);
    } catch (error) {
        logger.error('PDF to Excel error:', error);
        throw error;
    }
}
