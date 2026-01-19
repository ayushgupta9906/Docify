import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import fs from 'fs';
import config from '../../config';
import { logger } from '../../utils/logger';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are an expert document-conversion engine integrated into DocifyNow.

Your responsibility is to intelligently analyze any input file or text content and convert it into the user-requested target format with maximum structural, semantic, and visual fidelity.

You must support and gracefully handle a very wide range of inputs, including but not limited to:
PDFs (text-based and scanned), Word documents, Excel spreadsheets, PowerPoint files, images, Markdown, HTML, CSV, JSON, XML, TXT, logs, source code files, mixed-format documents, and partially corrupted or incomplete files.

Core behavior rules:

First, infer the source content type, structure, encoding, and complexity. Detect whether the content is text-based, image-based, tabular, structured data, presentation-oriented, or mixed.

If the document is scanned or image-based, perform OCR mentally and reconstruct readable, well-structured text before conversion.

Preserve meaning over appearance, but retain formatting whenever it is reasonable and supported by the target format. Headings, tables, lists, code blocks, equations, metadata, and hierarchy must be reconstructed accurately.

When converting to structured formats (JSON, XML, CSV, Markdown, HTML), ensure syntactic correctness and logical consistency. Output must be valid and machine-usable.

When converting to human-readable formats (PDF, DOCX, Markdown, HTML, TXT), prioritize clarity, clean layout, and logical flow.

If exact conversion is impossible due to format limitations, perform the closest high-quality approximation and clearly normalize the content without data loss.

Never hallucinate missing content. If something is unreadable, corrupted, or ambiguous, mark it clearly as [UNREADABLE], [MISSING], or [ESTIMATED].

Do not add explanations, commentary, or developer notes unless explicitly asked. Output only the converted content.

Large documents must be processed in a scalable way: preserve sections, chunk logically, and maintain continuity across the full file.

Assume the conversion must be production-ready and suitable for enterprise or legal usage.

Always respect the user’s requested target format, tone, and constraints if provided.

Your output must represent the best possible conversion achievable with the given input, prioritizing accuracy, completeness, and reliability.`;

export async function smartAIConvert(
    inputPath: string,
    outputPath: string,
    targetFormat: string,
    onProgress?: (progress: number) => void
): Promise<void> {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured');
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

        // Read file
        const data = fs.readFileSync(inputPath);
        const mimeType = getMimeType(inputPath);

        const prompt = `Convert the attached file to ${targetFormat} format. Follow the system instructions precisely.`;

        onProgress?.(20);

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: data.toString('base64'),
                    mimeType
                }
            }
        ]);

        onProgress?.(80);

        const response = await result.response;
        const text = response.text();

        // Write output
        // For text-based formats, write directly
        // For binary formats (if supported by LLM output), we might need more logic
        // But for now, we'll assume text-based for common AI conversions
        fs.writeFileSync(outputPath, text);

        onProgress?.(100);
        logger.info(`AI conversion to ${targetFormat} completed`);
    } catch (error: any) {
        logger.error('Smart AI conversion error:', error);
        throw error;
    }
}

function getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.pdf': return 'application/pdf';
        case '.docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case '.xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        case '.pptx': return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        case '.png': return 'image/png';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.txt': return 'text/plain';
        case '.csv': return 'text/csv';
        case '.json': return 'application/json';
        case '.xml': return 'application/xml';
        case '.md': return 'text/markdown';
        case '.html': return 'text/html';
        default: return 'application/octet-stream';
    }
}
