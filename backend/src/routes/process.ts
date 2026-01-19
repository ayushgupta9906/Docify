import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Job } from '../models/Job.model';
import { logger } from '../utils/logger';
import config from '../config';
import path from 'path';

// Import processing services
import { mergePDFs } from '../services/pdf/merge.service';
import { splitPDF } from '../services/pdf/split.service';
import { compressPDF } from '../services/pdf/compress.service';
import { rotatePDF } from '../services/pdf/rotate.service';
import { imageToPDF } from '../services/pdf/image-to-pdf.service';
import { pdfToExcel } from '../services/pdf/pdf-to-excel.service';
import { pdfToXML } from '../services/pdf/pdf-to-xml.service';
import { pdfToWord, wordToPDF } from '../services/pdf/word-conversion.service';
import { pdfToJPG, jpgToPDF } from '../services/pdf/image-conversion.service';
import { genericPDFTool } from '../services/pdf/generic.service';

import { processUniversalTask } from '../services/universal/universal.service';

const router = Router();

// Helper to get input file paths
function getInputFilePaths(fileIds: string[], tempDir: string): string[] {
    return fileIds.map((id) => {
        const extensions = ['.pdf', '.docx', '.pptx', '.xlsx', '.jpg', '.jpeg', '.png', '.json', '.xml', '.csv', '.md', '.html', '.txt', '.yaml', '.zip'];
        for (const ext of extensions) {
            const filePath = path.join(tempDir, `${id}${ext}`);
            if (require('fs').existsSync(filePath)) return filePath;
        }
        throw new Error(`File not found: ${id}`);
    });
}

// Merge PDF
router.post('/merge', async (req: Request, res: Response) => {
    try {
        const { fileIds, options } = req.body;

        if (!fileIds || !Array.isArray(fileIds) || fileIds.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'At least 2 files required',
            });
        }

        const jobId = uuidv4();
        const tempDir = path.join(config.UPLOAD_DIR, 'temp');
        const resultsDir = path.join(config.UPLOAD_DIR, 'results');

        const inputPaths = getInputFilePaths(fileIds, tempDir);
        const outputPath = path.join(resultsDir, `${jobId}_merged.pdf`);

        // Create job
        const job = await Job.create({
            jobId,
            status: 'pending',
            tool: 'merge',
            inputFiles: inputPaths.map((p) => ({
                filename: path.basename(p),
                originalName: path.basename(p),
                path: p,
                size: require('fs').statSync(p).size,
                mimeType: 'application/pdf',
            })),
            options,
            progress: 0,
            expiresAt: new Date(Date.now() + config.FILE_EXPIRY_MINUTES * 60 * 1000),
        });

        // Process in background
        setImmediate(async () => {
            try {
                await job.updateOne({ status: 'processing', progress: 50 });

                await mergePDFs(inputPaths, outputPath);

                const stats = require('fs').statSync(outputPath);
                await Job.updateOne({ jobId }, {
                    status: 'completed',
                    progress: 100,
                    outputFile: {
                        filename: path.basename(outputPath),
                        path: outputPath,
                        size: stats.size,
                    },
                });

                logger.info(`Job ${jobId} completed successfully`);
            } catch (error: any) {
                logger.error(`Job ${jobId} failed:`, error);
                await Job.updateOne({ jobId }, {
                    status: 'failed',
                    error: error.message,
                });
            }
        });

        return res.json({
            success: true,
            data: {
                jobId,
                status: 'pending',
            },
        });
    } catch (error: any) {
        logger.error('Merge error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Merge failed',
        });
    }
});

// Split PDF
router.post('/split', async (req: Request, res: Response) => {
    try {
        const { fileIds, options } = req.body;

        if (!fileIds || fileIds.length !== 1) {
            return res.status(400).json({
                success: false,
                error: 'Exactly 1 file required',
            });
        }

        const jobId = uuidv4();
        const tempDir = path.join(config.UPLOAD_DIR, 'temp');
        const resultsDir = path.join(config.UPLOAD_DIR, 'results');

        const inputPath = getInputFilePaths([fileIds[0]], tempDir)[0];
        const outputPath = path.join(resultsDir, `${jobId}_split.zip`);

        const job = await Job.create({
            jobId,
            status: 'pending',
            tool: 'split',
            inputFiles: [{
                filename: path.basename(inputPath),
                originalName: path.basename(inputPath),
                path: inputPath,
                size: require('fs').statSync(inputPath).size,
                mimeType: 'application/pdf',
            }],
            options,
            progress: 0,
            expiresAt: new Date(Date.now() + config.FILE_EXPIRY_MINUTES * 60 * 1000),
        });

        setImmediate(async () => {
            try {
                await job.updateOne({ status: 'processing', progress: 50 });

                await splitPDF(inputPath, outputPath, options);

                // If only one file was split, the service might have saved it as .pdf instead of .zip
                const finalPath = (require('fs').existsSync(outputPath.replace('.zip', '.pdf')) && !require('fs').existsSync(outputPath))
                    ? outputPath.replace('.zip', '.pdf')
                    : outputPath;

                const stats = require('fs').statSync(finalPath);
                await job.updateOne({
                    status: 'completed',
                    progress: 100,
                    outputFile: {
                        filename: path.basename(finalPath),
                        path: finalPath,
                        size: stats.size,
                    },
                });

                logger.info(`Job ${jobId} completed successfully`);
            } catch (error: any) {
                logger.error(`Job ${jobId} failed:`, error);
                await job.updateOne({
                    status: 'failed',
                    error: error.message,
                });
            }
        });

        return res.json({
            success: true,
            data: {
                jobId,
                status: 'pending',
            },
        });
    } catch (error: any) {
        logger.error('Split error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Split failed',
        });
    }
});

// Compress PDF
router.post('/compress', async (req: Request, res: Response) => {
    try {
        const { fileIds, options } = req.body;

        if (!fileIds || fileIds.length !== 1) {
            return res.status(400).json({
                success: false,
                error: 'Exactly 1 file required',
            });
        }

        const jobId = uuidv4();
        const tempDir = path.join(config.UPLOAD_DIR, 'temp');
        const resultsDir = path.join(config.UPLOAD_DIR, 'results');

        const inputPath = getInputFilePaths([fileIds[0]], tempDir)[0];
        const outputPath = path.join(resultsDir, `${jobId}_compressed.pdf`);

        const job = await Job.create({
            jobId,
            status: 'pending',
            tool: 'compress',
            inputFiles: [{
                filename: path.basename(inputPath),
                originalName: path.basename(inputPath),
                path: inputPath,
                size: require('fs').statSync(inputPath).size,
                mimeType: 'application/pdf',
            }],
            options,
            progress: 0,
            expiresAt: new Date(Date.now() + config.FILE_EXPIRY_MINUTES * 60 * 1000),
        });

        setImmediate(async () => {
            try {
                await job.updateOne({ status: 'processing', progress: 50 });

                await compressPDF(inputPath, outputPath, options?.quality || 'medium');

                const stats = require('fs').statSync(outputPath);
                await job.updateOne({
                    status: 'completed',
                    progress: 100,
                    outputFile: {
                        filename: path.basename(outputPath),
                        path: outputPath,
                        size: stats.size,
                    },
                });

                logger.info(`Job ${jobId} completed successfully`);
            } catch (error: any) {
                logger.error(`Job ${jobId} failed:`, error);
                await job.updateOne({
                    status: 'failed',
                    error: error.message,
                });
            }
        });

        return res.json({
            success: true,
            data: {
                jobId,
                status: 'pending',
            },
        });
    } catch (error: any) {
        logger.error('Compress error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Compression failed',
        });
    }
});

// Rotate PDF
router.post('/rotate', async (req: Request, res: Response) => {
    try {
        const { fileIds, options } = req.body;

        if (!fileIds || fileIds.length !== 1) {
            return res.status(400).json({
                success: false,
                error: 'Exactly 1 file required',
            });
        }

        if (!options?.rotation) {
            return res.status(400).json({
                success: false,
                error: 'Rotation angle required',
            });
        }

        const jobId = uuidv4();
        const tempDir = path.join(config.UPLOAD_DIR, 'temp');
        const resultsDir = path.join(config.UPLOAD_DIR, 'results');

        const inputPath = getInputFilePaths([fileIds[0]], tempDir)[0];
        const outputPath = path.join(resultsDir, `${jobId}_rotated.pdf`);

        const job = await Job.create({
            jobId,
            status: 'pending',
            tool: 'rotate',
            inputFiles: [{
                filename: path.basename(inputPath),
                originalName: path.basename(inputPath),
                path: inputPath,
                size: require('fs').statSync(inputPath).size,
                mimeType: 'application/pdf',
            }],
            options,
            progress: 0,
            expiresAt: new Date(Date.now() + config.FILE_EXPIRY_MINUTES * 60 * 1000),
        });

        setImmediate(async () => {
            try {
                await job.updateOne({ status: 'processing', progress: 50 });

                await rotatePDF(inputPath, outputPath, options.rotation, options.pages);

                const stats = require('fs').statSync(outputPath);
                await job.updateOne({
                    status: 'completed',
                    progress: 100,
                    outputFile: {
                        filename: path.basename(outputPath),
                        path: outputPath,
                        size: stats.size,
                    },
                });

                logger.info(`Job ${jobId} completed successfully`);
            } catch (error: any) {
                logger.error(`Job ${jobId} failed:`, error);
                await job.updateOne({
                    status: 'failed',
                    error: error.message,
                });
            }
        });

        return res.json({
            success: true,
            data: {
                jobId,
                status: 'pending',
            },
        });
    } catch (error: any) {
        logger.error('Rotate error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Rotation failed',
        });
    }
});

// Image to PDF
router.post('/image-to-pdf', async (req: Request, res: Response) => {
    try {
        const { fileIds, options } = req.body;

        if (!fileIds || !Array.isArray(fileIds) || fileIds.length < 1) {
            return res.status(400).json({
                success: false,
                error: 'At least 1 file required',
            });
        }

        const jobId = uuidv4();
        const tempDir = path.join(config.UPLOAD_DIR, 'temp');
        const resultsDir = path.join(config.UPLOAD_DIR, 'results');

        const inputPaths = getInputFilePaths(fileIds, tempDir);
        const outputPath = path.join(resultsDir, `${jobId}_converted.pdf`);

        const job = await Job.create({
            jobId,
            status: 'pending',
            tool: 'image-to-pdf',
            inputFiles: inputPaths.map((p) => ({
                filename: path.basename(p),
                originalName: path.basename(p),
                path: p,
                size: require('fs').statSync(p).size,
                mimeType: p.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
            })),
            options,
            progress: 0,
            expiresAt: new Date(Date.now() + config.FILE_EXPIRY_MINUTES * 60 * 1000),
        });

        setImmediate(async () => {
            try {
                await job.updateOne({ status: 'processing', progress: 50 });

                await imageToPDF(inputPaths, outputPath);

                const stats = require('fs').statSync(outputPath);
                await job.updateOne({
                    status: 'completed',
                    progress: 100,
                    outputFile: {
                        filename: path.basename(outputPath),
                        path: outputPath,
                        size: stats.size,
                    },
                });

                logger.info(`Job ${jobId} completed successfully`);
            } catch (error: any) {
                logger.error(`Job ${jobId} failed:`, error);
                await job.updateOne({
                    status: 'failed',
                    error: error.message,
                });
            }
        });

        return res.json({
            success: true,
            data: {
                jobId,
                status: 'pending',
            },
        });
    } catch (error: any) {
        logger.error('Image to PDF error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Image to PDF failed',
        });
    }
});

// PDF to Excel
router.post('/pdf-to-excel', async (req: Request, res: Response) => {
    try {
        const { fileIds, options } = req.body;

        if (!fileIds || fileIds.length !== 1) {
            return res.status(400).json({
                success: false,
                error: 'Exactly 1 file required',
            });
        }

        const jobId = uuidv4();
        const tempDir = path.join(config.UPLOAD_DIR, 'temp');
        const resultsDir = path.join(config.UPLOAD_DIR, 'results');

        const inputPath = getInputFilePaths([fileIds[0]], tempDir)[0];
        const outputPath = path.join(resultsDir, `${jobId}_converted.csv`);

        const job = await Job.create({
            jobId,
            status: 'pending',
            tool: 'pdf-to-excel',
            inputFiles: [{
                filename: path.basename(inputPath),
                originalName: path.basename(inputPath),
                path: inputPath,
                size: require('fs').statSync(inputPath).size,
                mimeType: 'application/pdf',
            }],
            options,
            progress: 0,
            expiresAt: new Date(Date.now() + config.FILE_EXPIRY_MINUTES * 60 * 1000),
        });

        setImmediate(async () => {
            try {
                await job.updateOne({ status: 'processing', progress: 10 });

                await pdfToExcel(inputPath, outputPath, async (progress) => {
                    await job.updateOne({ progress: Math.min(95, 10 + (progress * 0.85)) });
                });

                const stats = require('fs').statSync(outputPath);
                await job.updateOne({
                    status: 'completed',
                    progress: 100,
                    outputFile: {
                        filename: path.basename(outputPath),
                        path: outputPath,
                        size: stats.size,
                    },
                });

                logger.info(`Job ${jobId} completed successfully`);
            } catch (error: any) {
                logger.error(`Job ${jobId} failed:`, error);
                await job.updateOne({
                    status: 'failed',
                    error: error.message,
                });
            }
        });

        return res.json({
            success: true,
            data: {
                jobId,
                status: 'pending',
            },
        });
    } catch (error: any) {
        logger.error('PDF to Excel error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'PDF to Excel failed',
        });
    }
});

// PDF to XML
router.post('/pdf-to-xml', async (req: Request, res: Response) => {
    try {
        const { fileIds, options } = req.body;
        if (!fileIds || fileIds.length !== 1) return res.status(400).json({ success: false, error: 'Exactly 1 file required' });
        const jobId = uuidv4();
        const inputPath = getInputFilePaths([fileIds[0]], path.join(config.UPLOAD_DIR, 'temp'))[0];
        const outputPath = path.join(config.UPLOAD_DIR, 'results', `${jobId}_converted.xml`);
        const job = await Job.create({ jobId, status: 'pending', tool: 'pdf-to-xml', inputFiles: [{ filename: path.basename(inputPath), path: inputPath, size: require('fs').statSync(inputPath).size, mimeType: 'application/pdf' }], expiresAt: new Date(Date.now() + config.FILE_EXPIRY_MINUTES * 60 * 1000) });
        setImmediate(async () => {
            try {
                await job.updateOne({ status: 'processing', progress: 10 });
                await pdfToXML(inputPath, outputPath, async (progress) => {
                    await job.updateOne({ progress: Math.min(95, 10 + (progress * 0.85)) });
                });
                await job.updateOne({ status: 'completed', progress: 100, outputFile: { filename: path.basename(outputPath), path: outputPath, size: require('fs').statSync(outputPath).size } });
            } catch (error: any) { await job.updateOne({ status: 'failed', error: error.message }); }
        });
        return res.json({ success: true, data: { jobId, status: 'pending' } });
    } catch (error: any) { res.status(500).json({ success: false, error: error.message }); }
});

// PDF to Word
router.post('/pdf-to-word', async (req: Request, res: Response) => {
    try {
        const { fileIds } = req.body;
        if (!fileIds || fileIds.length !== 1) return res.status(400).json({ success: false, error: 'Exactly 1 file required' });
        const jobId = uuidv4();
        const inputPath = getInputFilePaths([fileIds[0]], path.join(config.UPLOAD_DIR, 'temp'))[0];
        const outputPath = path.join(config.UPLOAD_DIR, 'results', `${jobId}_converted.docx`);
        const job = await Job.create({ jobId, status: 'pending', tool: 'pdf-to-word', inputFiles: [{ filename: path.basename(inputPath), path: inputPath, size: require('fs').statSync(inputPath).size, mimeType: 'application/pdf' }], expiresAt: new Date(Date.now() + config.FILE_EXPIRY_MINUTES * 60 * 1000) });
        setImmediate(async () => {
            try { await job.updateOne({ status: 'processing', progress: 50 }); await pdfToWord(inputPath, outputPath); await job.updateOne({ status: 'completed', progress: 100, outputFile: { filename: path.basename(outputPath), path: outputPath, size: require('fs').statSync(outputPath).size } }); }
            catch (error: any) { await job.updateOne({ status: 'failed', error: error.message }); }
        });
        return res.json({ success: true, data: { jobId, status: 'pending' } });
    } catch (error: any) { res.status(500).json({ success: false, error: error.message }); }
});

// Word to PDF
router.post('/word-to-pdf', async (req: Request, res: Response) => {
    try {
        const { fileIds } = req.body;
        if (!fileIds || fileIds.length !== 1) return res.status(400).json({ success: false, error: 'Exactly 1 file required' });
        const jobId = uuidv4();
        const inputPath = getInputFilePaths([fileIds[0]], path.join(config.UPLOAD_DIR, 'temp'))[0];
        const outputPath = path.join(config.UPLOAD_DIR, 'results', `${jobId}_converted.pdf`);
        const job = await Job.create({ jobId, status: 'pending', tool: 'word-to-pdf', inputFiles: [{ filename: path.basename(inputPath), path: inputPath, size: require('fs').statSync(inputPath).size, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }], expiresAt: new Date(Date.now() + config.FILE_EXPIRY_MINUTES * 60 * 1000) });
        setImmediate(async () => {
            try { await job.updateOne({ status: 'processing', progress: 50 }); await wordToPDF(inputPath, outputPath); await job.updateOne({ status: 'completed', progress: 100, outputFile: { filename: path.basename(outputPath), path: outputPath, size: require('fs').statSync(outputPath).size } }); }
            catch (error: any) { await job.updateOne({ status: 'failed', error: error.message }); }
        });
        return res.json({ success: true, data: { jobId, status: 'pending' } });
    } catch (error: any) { res.status(500).json({ success: false, error: error.message }); }
});

// PDF to JPG
router.post('/pdf-to-jpg', async (req: Request, res: Response) => {
    try {
        const { fileIds } = req.body;
        if (!fileIds || fileIds.length !== 1) return res.status(400).json({ success: false, error: 'Exactly 1 file required' });
        const jobId = uuidv4();
        const inputPath = getInputFilePaths([fileIds[0]], path.join(config.UPLOAD_DIR, 'temp'))[0];
        const outputPath = path.join(config.UPLOAD_DIR, 'results', `${jobId}_converted.zip`);
        const job = await Job.create({ jobId, status: 'pending', tool: 'pdf-to-jpg', inputFiles: [{ filename: path.basename(inputPath), path: inputPath, size: require('fs').statSync(inputPath).size, mimeType: 'application/pdf' }], expiresAt: new Date(Date.now() + config.FILE_EXPIRY_MINUTES * 60 * 1000) });
        setImmediate(async () => {
            try {
                await pdfToJPG(inputPath, outputPath);

                const finalPath = (require('fs').existsSync(outputPath.replace('.zip', '.jpg')) && !require('fs').existsSync(outputPath))
                    ? outputPath.replace('.zip', '.jpg')
                    : outputPath;

                const stats = require('fs').statSync(finalPath);
                await job.updateOne({
                    status: 'completed',
                    progress: 100,
                    outputFile: {
                        filename: path.basename(finalPath),
                        path: finalPath,
                        size: stats.size,
                    },
                });
            } catch (error: any) { await job.updateOne({ status: 'failed', error: error.message }); }
        });
        return res.json({ success: true, data: { jobId, status: 'pending' } });
    } catch (error: any) { res.status(500).json({ success: false, error: error.message }); }
});

// JPG to PDF
router.post('/jpg-to-pdf', async (req: Request, res: Response) => {
    try {
        const { fileIds } = req.body;
        if (!fileIds || !Array.isArray(fileIds) || fileIds.length < 1) return res.status(400).json({ success: false, error: 'At least 1 file required' });
        const jobId = uuidv4();
        const inputPaths = getInputFilePaths(fileIds, path.join(config.UPLOAD_DIR, 'temp'));
        const outputPath = path.join(config.UPLOAD_DIR, 'results', `${jobId}_converted.pdf`);
        const job = await Job.create({ jobId, status: 'pending', tool: 'jpg-to-pdf', inputFiles: inputPaths.map(p => ({ filename: path.basename(p), path: p, size: require('fs').statSync(p).size, mimeType: 'image/jpeg' })), expiresAt: new Date(Date.now() + config.FILE_EXPIRY_MINUTES * 60 * 1000) });
        setImmediate(async () => {
            try { await job.updateOne({ status: 'processing', progress: 50 }); await jpgToPDF(inputPaths, outputPath); await job.updateOne({ status: 'completed', progress: 100, outputFile: { filename: path.basename(outputPath), path: outputPath, size: require('fs').statSync(outputPath).size } }); }
            catch (error: any) { await job.updateOne({ status: 'failed', error: error.message }); }
        });
        return res.json({ success: true, data: { jobId, status: 'pending' } });
    } catch (error: any) { res.status(500).json({ success: false, error: error.message }); }
});

// Universal Catch-All Handler (handles all tools not specifically handled above)
router.post('/:tool', async (req: Request, res: Response) => {
    try {
        const tool = req.params.tool as string;
        const { fileIds, options } = req.body;

        if (!fileIds || !Array.isArray(fileIds) || fileIds.length < 1) {
            return res.status(400).json({ success: false, error: 'At least 1 file required' });
        }

        const jobId = uuidv4();
        const inputPaths = getInputFilePaths(fileIds, path.join(config.UPLOAD_DIR, 'temp'));

        // Determine output extension based on tool or default to .pdf
        let outExt = '.pdf';
        if (tool.includes('-to-csv')) outExt = '.csv';
        else if (tool.includes('-to-json')) outExt = '.json';
        else if (tool.includes('-to-xml')) outExt = '.xml';
        else if (tool.includes('-to-webp')) outExt = '.webp';
        else if (tool.includes('-to-jpg')) outExt = '.jpg';
        else if (tool.includes('-to-markdown')) outExt = '.md';
        else if (tool.includes('-to-html')) outExt = '.html';
        else if (tool.includes('-to-ppt')) outExt = '.pptx';
        else if (tool.includes('-to-word')) outExt = '.docx';

        const outputPath = path.join(config.UPLOAD_DIR, 'results', `${jobId}_output${outExt}`);

        const job = await Job.create({
            jobId,
            status: 'pending',
            tool,
            inputFiles: inputPaths.map(p => ({
                filename: path.basename(p),
                originalName: path.basename(p),
                path: p,
                size: require('fs').statSync(p).size,
                mimeType: 'application/octet-stream' // Generic
            })),
            options,
            progress: 0,
            expiresAt: new Date(Date.now() + config.FILE_EXPIRY_MINUTES * 60 * 1000)
        });

        setImmediate(async () => {
            try {
                await job.updateOne({ status: 'processing', progress: 20 });

                // If it's a PDF specific legacy tool, use genericPDFTool
                const pdfLegacyTools = ['reorder', 'delete-pages', 'protect', 'unlock', 'watermark', 'page-numbers', 'repair', 'ocr'];
                if (pdfLegacyTools.includes(tool)) {
                    await genericPDFTool(tool, inputPaths[0], outputPath, options);
                } else {
                    // Use universal dispatcher
                    await processUniversalTask(tool, inputPaths[0], outputPath, options);
                }

                const stats = require('fs').statSync(outputPath);
                await job.updateOne({
                    status: 'completed',
                    progress: 100,
                    outputFile: {
                        filename: path.basename(outputPath),
                        path: outputPath,
                        size: stats.size
                    }
                });
            } catch (error: any) {
                logger.error(`Universal job ${jobId} failed:`, error);
                await job.updateOne({ status: 'failed', error: error.message });
            }
        });

        return res.json({ success: true, data: { jobId, status: 'pending' } });
    } catch (error: any) {
        logger.error('Universal route error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
