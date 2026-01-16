import cron from 'node-cron';
import fs from 'fs/promises';
import path from 'path';
import config from '../../config';
import { logger } from '../../utils/logger';
import { Job } from '../../models/Job.model';

export function startCleanupCron() {
    // Run every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
        logger.info('Running cleanup job...');

        try {
            const now = new Date();

            // Find expired jobs
            const expiredJobs = await Job.find({
                expiresAt: { $lt: now },
            });

            logger.info(`Found ${expiredJobs.length} expired jobs to clean up`);

            for (const job of expiredJobs) {
                try {
                    // Delete output file
                    if (job.outputFile?.path) {
                        try {
                            await fs.unlink(job.outputFile.path);
                            logger.debug(`Deleted output file: ${job.outputFile.path}`);
                        } catch (err) {
                            // File may already be deleted
                        }
                    }

                    // Delete input files
                    for (const file of job.inputFiles) {
                        try {
                            await fs.unlink(file.path);
                            logger.debug(`Deleted input file: ${file.path}`);
                        } catch (err) {
                            // File may already be deleted
                        }
                    }

                    // Delete job from database
                    await Job.deleteOne({ _id: job._id });

                    logger.info(`Cleaned up job: ${job.jobId}`);
                } catch (error) {
                    logger.error(`Error cleaning up job ${job.jobId}:`, error);
                }
            }

            // Also cleanup orphaned files in temp and results directories
            await cleanupOrphanedFiles();

            logger.info('Cleanup job completed');
        } catch (error) {
            logger.error('Cleanup cron error:', error);
        }
    });

    logger.info('Cleanup cron job started (runs every 10 minutes)');
}

async function cleanupOrphanedFiles() {
    try {
        const tempDir = path.join(config.UPLOAD_DIR, 'temp');
        const resultsDir = path.join(config.UPLOAD_DIR, 'results');

        const expiryTime = Date.now() - (config.FILE_EXPIRY_MINUTES * 60 * 1000);

        // Clean temp directory
        const tempFiles = await fs.readdir(tempDir);
        for (const file of tempFiles) {
            const filePath = path.join(tempDir, file);
            const stats = await fs.stat(filePath);

            if (stats.mtimeMs < expiryTime) {
                await fs.unlink(filePath);
                logger.debug(`Deleted orphaned temp file: ${file}`);
            }
        }

        // Clean results directory
        const resultFiles = await fs.readdir(resultsDir);
        for (const file of resultFiles) {
            const filePath = path.join(resultsDir, file);
            const stats = await fs.stat(filePath);

            if (stats.mtimeMs < expiryTime) {
                await fs.unlink(filePath);
                logger.debug(`Deleted orphaned result file: ${file}`);
            }
        }
    } catch (error) {
        logger.error('Error cleaning orphaned files:', error);
    }
}
