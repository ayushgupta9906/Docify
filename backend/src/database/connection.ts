import mongoose from 'mongoose';
import config from '../config';
import { logger } from '../utils/logger';

export async function connectDatabase() {
    try {
        await mongoose.connect(config.MONGODB_URI);
        logger.info(`✅ MongoDB connected: ${config.MONGODB_URI}`);

        mongoose.connection.on('error', (error) => {
            logger.error('MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });
    } catch (error) {
        logger.error('Failed to connect to MongoDB:', error);
        // Continue without database in development
        if (config.NODE_ENV === 'production') {
            throw error;
        } else {
            logger.warn('Continuing without database (development mode)');
        }
    }
}
