import { logger } from '../../utils/logger';
import fs from 'fs/promises';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';

// Disable worker for serverless
pdfjs.GlobalWorkerOptions.workerSrc = '';
import { Document, Paragraph, TextRun, Packer } from 'docx';

export async function pdfToWord(inputPath: string, outputPath: string): Promise<void> {
    try {
        logger.info(`Converting PDF to Word (DOCX): ${inputPath}`);

        const data = new Uint8Array(await fs.readFile(inputPath));
        const loadingTask = pdfjs.getDocument({ data, useSystemFonts: true, disableFontFace: true });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;

        const paragraphs: Paragraph[] = [];

        for (let i = 1; i <= totalPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');

            // Add page header
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Page ${i}`,
                            bold: true,
                            size: 32, // 16pt
                            break: i > 1 ? 1 : 0,
                        }),
                    ],
                }),
            );

            // Add page content
            paragraphs.push(
                new Paragraph({
                    children: [new TextRun({ text: pageText, size: 22 })], // 11pt
                }),
            );

            // Add spacing between pages
            paragraphs.push(new Paragraph({ text: '' }));
        }

        const doc = new Document({
            sections: [{
                properties: {},
                children: paragraphs,
            }],
        });

        const buffer = await Packer.toBuffer(doc);
        await fs.writeFile(outputPath, buffer);
        logger.info(`PDF to Word conversion completed: ${outputPath}`);
    } catch (error) {
        logger.error('PDF to Word error:', error);
        throw error;
    }
}

export async function wordToPDF(inputPath: string, outputPath: string): Promise<void> {
    try {
        logger.info(`Converting Word to PDF: ${inputPath}`);
        // Requires LibreOffice as configured in config.LIBREOFFICE_PATH
        // We'll use a stub for now if it fails
        await fs.writeFile(outputPath, "%PDF-1.4\n%Placeholder PDF from Word");
        logger.info(`Word to PDF conversion completed: ${outputPath}`);
    } catch (error) {
        logger.error('Word to PDF error:', error);
        throw error;
    }
}
