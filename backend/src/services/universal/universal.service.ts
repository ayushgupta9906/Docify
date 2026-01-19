import { logger } from '../../utils/logger';
import fs from 'fs/promises';
import path from 'path';
import * as xlsx from 'xlsx';
import sharp from 'sharp';
import yaml from 'js-yaml';
import { parseStringPromise, Builder } from 'xml2js';
import { marked } from 'marked';
import TurndownService from 'turndown';
import { processWithAI } from '../ai/gemini.service';
import { PDFDocument } from 'pdf-lib';

const turndownService = new TurndownService();

export async function processUniversalTask(toolId: string, inputPath: string, outputPath: string, options: any = {}): Promise<void> {
    try {
        logger.info(`Universal Dispatcher: ${toolId} for ${inputPath}`);
        const inputExt = path.extname(inputPath).toLowerCase();
        const inputBuffer = await fs.readFile(inputPath);

        // --- DATA & SPREADSHEETS ---
        if (toolId === 'csv-to-json' || toolId === 'excel-to-json') {
            const workbook = xlsx.read(inputBuffer);
            const sheetName = workbook.SheetNames[0];
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
            await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
            return;
        }

        if (toolId === 'excel-to-csv' || toolId === 'json-to-csv') {
            let data;
            if (inputExt === '.json') {
                data = JSON.parse(inputBuffer.toString());
            } else {
                const workbook = xlsx.read(inputBuffer);
                const sheetName = workbook.SheetNames[0];
                data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
            }
            const worksheet = xlsx.utils.json_to_sheet(data as any[]);
            const csv = xlsx.utils.sheet_to_csv(worksheet);
            await fs.writeFile(outputPath, csv);
            return;
        }

        // --- IMAGES ---
        if (toolId === 'png-to-webp' || toolId === 'jpg-to-webp' || toolId === 'png-to-jpg') {
            const format = toolId.split('-to-')[1] as any;
            await sharp(inputBuffer)
                .toFormat(format)
                .toFile(outputPath);
            return;
        }

        if (toolId === 'svg-to-png') {
            await sharp(inputBuffer)
                .png()
                .toFile(outputPath);
            return;
        }

        // --- DEVELOPER TOOLS ---
        if (toolId === 'json-to-xml') {
            const json = JSON.parse(inputBuffer.toString());
            const builder = new Builder();
            const xml = builder.buildObject(json);
            await fs.writeFile(outputPath, xml);
            return;
        }

        if (toolId === 'xml-to-json') {
            const xml = inputBuffer.toString();
            const json = await parseStringPromise(xml);
            await fs.writeFile(outputPath, JSON.stringify(json, null, 2));
            return;
        }

        if (toolId === 'yaml-to-json') {
            const data = yaml.load(inputBuffer.toString());
            await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
            return;
        }

        // --- WEB & MARKUP ---
        if (toolId === 'html-to-markdown') {
            const markdown = turndownService.turndown(inputBuffer.toString());
            await fs.writeFile(outputPath, markdown);
            return;
        }

        if (toolId === 'markdown-to-html') {
            const html = await marked(inputBuffer.toString());
            await fs.writeFile(outputPath, html);
            return;
        }

        // --- AI POWERED (INTEL) ---
        const aiTools = ['invoice-to-data', 'receipt-to-csv', 'handwriting-to-text', 'ocr-pdf', 'translate-doc', 'unstructured-to-json'];
        if (aiTools.includes(toolId)) {
            const resultText = await processWithAI(toolId, inputPath, options);
            await fs.writeFile(outputPath, resultText);
            return;
        }

        // --- FALLBACK (PASSTHROUGH OR ERROR) ---
        logger.warn(`Tool ${toolId} not found in Universal Service. Falling back to base copy.`);
        await fs.copyFile(inputPath, outputPath);

    } catch (error: any) {
        logger.error(`Universal Task Error (${toolId}):`, error);
        throw new Error(`Universal Task Failed: ${error.message}`);
    }
}
