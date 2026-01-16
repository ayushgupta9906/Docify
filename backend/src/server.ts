import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import config from './config';
import { connectDatabase } from './database/connection';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/error.middleware';

// Routes
import uploadRoutes from './routes/upload';
import processRoutes from './routes/process';
import jobRoutes from './routes/jobs';
import batchRoutes from './routes/batch';

// Services
import { startCleanupCron } from './services/storage/cleanup.service';

const app = express();

// Middleware
app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create upload directories (only if not on Vercel)
if (!process.env.VERCEL) {
    const uploadDirs = [
        path.join(config.UPLOAD_DIR, 'temp'),
        path.join(config.UPLOAD_DIR, 'results'),
    ];

    uploadDirs.forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            logger.info(`Created directory: ${dir}`);
        }
    });
}

// Health check
app.get('/', (_req, res) => {
    return res.json({ message: 'Docify API is running', version: '1.0.0' });
});

app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: config.NODE_ENV,
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Backward compatible health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/process', processRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/batch', batchRoutes);

// Error Handling
app.use(errorHandler);

// Start Server
const PORT = config.PORT || 3001;

async function startServer() {
    try {
        await connectDatabase();

        // Start cleanup cron only if not on Vercel
        if (!process.env.VERCEL) {
            startCleanupCron();
        }

        if (process.env.NODE_ENV !== 'production') {
            app.listen(PORT, () => {
                logger.info(`🚀 Server running on port ${PORT}`);
                logger.info(`📁 Upload directory: ${config.UPLOAD_DIR}`);
                logger.info(`🌍 Frontend URL: ${config.FRONTEND_URL}`);
                logger.info(`🔧 Environment: ${config.NODE_ENV}`);
            });
        }
    } catch (error) {
        logger.error('Failed to start server:', error);
        // On Vercel, we can't exit, but we want to log the error
        if (!process.env.VERCEL) {
            process.exit(1);
        }
    }
}

// Export app for Vercel
export default app;

// Initialize server
startServer();
