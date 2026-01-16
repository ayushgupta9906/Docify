import dotenv from 'dotenv';

dotenv.config();

export const config = {
    // Server
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3001', 10),
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

    // Database
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/docify',

    // Storage
    UPLOAD_DIR: process.env.VERCEL ? '/tmp' : (process.env.UPLOAD_DIR || './uploads'),
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '104857600', 10), // 100MB
    FILE_EXPIRY_MINUTES: parseInt(process.env.FILE_EXPIRY_MINUTES || '30', 10),

    // Security
    JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 min
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),

    // Processing
    MAX_CONCURRENT_JOBS: parseInt(process.env.MAX_CONCURRENT_JOBS || '5', 10),
    LIBREOFFICE_PATH: process.env.LIBREOFFICE_PATH || '/usr/bin/libreoffice',
    GHOSTSCRIPT_PATH: process.env.GHOSTSCRIPT_PATH || '/usr/bin/gs',
    IMAGEMAGICK_PATH: process.env.IMAGEMAGICK_PATH || '/usr/bin/convert',
    TESSERACT_PATH: process.env.TESSERACT_PATH || '/usr/bin/tesseract',

    // OCR
    TESSERACT_LANG: process.env.TESSERACT_LANG || 'eng',

    // Batch
    MAX_BATCH_SIZE: parseInt(process.env.MAX_BATCH_SIZE || '20', 10),
};

export default config;
