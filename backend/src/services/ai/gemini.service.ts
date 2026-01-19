import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "../../utils/logger";
import fs from 'fs/promises';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function processWithAI(toolId: string, inputPath: string, options: any = {}): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const fileData = await fs.readFile(inputPath);
        const mimeType = inputPath.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg';

        let prompt = "";

        switch (toolId) {
            case 'invoice-to-data':
                prompt = "Extract all data from this invoice and return it as a clean JSON object. Include fields like invoice_number, date, vendor_name, total_amount, tax, and item_list.";
                break;
            case 'receipt-to-csv':
                prompt = "Extract all items from this receipt and return them in CSV format. Include Columns: Date, Item, Quantity, Price.";
                break;
            case 'handwriting-to-text':
                prompt = "Transcribe the handwriting in this image into clear, formatted digital text.";
                break;
            case 'ocr-pdf':
                prompt = "Extract all text from this document, maintaining the structure as much as possible.";
                break;
            case 'translate-doc':
                prompt = `Translate this document into ${options.targetLanguage || 'English'} while preserving its formatting and core meaning.`;
                break;
            case 'unstructured-to-json':
                prompt = "Parse this document and restructure it into a professional JSON format based on its contents.";
                break;
            default:
                prompt = "Analyze this document and extract the core information in a structured format.";
        }

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: fileData.toString("base64"),
                    mimeType
                }
            }
        ]);

        const response = await result.response;
        return response.text();
    } catch (error) {
        logger.error(`AI processing error for ${toolId}:`, error);
        throw new Error(`AI processing failed: ${error}`);
    }
}
