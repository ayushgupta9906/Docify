import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import config from '../config';
import { logger } from '../utils/logger';

const router = Router();

// Configure multer
const tempDir = path.join(config.UPLOAD_DIR, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(config.UPLOAD_DIR, 'temp'));
    },
    filename: (_req, file, cb) => {
        const uniqueId = uuidv4();
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueId}${ext}`);
    },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'image/jpeg',
        'image/png',
        'image/jpg',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type: ${file.mimetype}. Only PDF, DOCX, PPTX, XLSX, and images are allowed.`));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: config.MAX_FILE_SIZE,
        files: 50,
    },
});

// Upload endpoint
router.post('/', upload.array('files', 50), async (req: Request, res: Response) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No files uploaded',
            });
        }

        const uploadedFiles = req.files.map((file) => ({
            fileId: path.basename(file.filename, path.extname(file.filename)),
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
            path: file.path,
        }));

        logger.info(`Uploaded ${uploadedFiles.length} files`);

        res.json({
            success: true,
            data: uploadedFiles,
        });
    } catch (error: any) {
        logger.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Upload failed',
        });
    }
});

export default router;
