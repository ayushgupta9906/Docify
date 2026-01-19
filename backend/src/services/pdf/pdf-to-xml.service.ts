import { logger } from '../../utils/logger';
import fs from 'fs/promises';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';

export async function pdfToXML(
    inputPath: string,
    outputPath: string,
    onProgress?: (progress: number) => Promise<void>
): Promise<void> {
    try {
        logger.info(`Converting PDF to XML: ${inputPath}`);

        const data = new Uint8Array(await fs.readFile(inputPath));
        const loadingTask = pdfjs.getDocument({ data, useSystemFonts: true, disableFontFace: true });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;

        let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<pdf>\n';

        for (let i = 1; i <= totalPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const items = textContent.items as any[];

            xmlContent += `  <page number="${i}">\n`;
            for (const item of items) {
                const escapedText = item.str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                xmlContent += `    <text x="${item.transform[4]}" y="${item.transform[5]}">${escapedText}</text>\n`;
            }
            xmlContent += `  </page>\n`;

            if (onProgress) {
                await onProgress(Math.round((i / totalPages) * 100));
            }
        }

        xmlContent += '</pdf>';
        await fs.writeFile(outputPath, xmlContent);
        logger.info(`PDF to XML conversion completed: ${outputPath}`);
    } catch (error) {
        logger.error('PDF to XML error:', error);
        throw error;
    }
}
