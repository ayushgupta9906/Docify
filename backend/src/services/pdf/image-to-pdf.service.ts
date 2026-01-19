import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import { logger } from '../../utils/logger';

export async function imageToPDF(
    inputPaths: string[],
    outputPath: string
): Promise<void> {
    try {
        logger.info(`Converting ${inputPaths.length} images to PDF`);

        const pdfDoc = await PDFDocument.create();

        for (const imagePath of inputPaths) {
            const imageBytes = await fs.readFile(imagePath);
            let image;

            if (imagePath.toLowerCase().endsWith('.jpg') || imagePath.toLowerCase().endsWith('.jpeg')) {
                image = await pdfDoc.embedJpg(imageBytes);
            } else if (imagePath.toLowerCase().endsWith('.png')) {
                image = await pdfDoc.embedPng(imageBytes);
            } else {
                logger.warn(`Unsupported image format: ${imagePath}`);
                continue;
            }

            const page = pdfDoc.addPage([image.width, image.height]);
            page.drawImage(image, {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height,
            });
        }

        const pdfBytes = await pdfDoc.save();
        await fs.writeFile(outputPath, pdfBytes);

        logger.info(`Image to PDF conversion completed: ${outputPath}`);
    } catch (error) {
        logger.error('Image to PDF error:', error);
        throw new Error(`Failed to convert image to PDF: ${(error as Error).message}`);
    }
}
