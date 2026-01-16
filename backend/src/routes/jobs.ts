import { Router, Request, Response } from 'express';
import { Job } from '../models/Job.model';
import { logger } from '../utils/logger';
import fs from 'fs';

const router = Router();

// Get job status
router.get('/:jobId', async (req: Request, res: Response) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findOne({ jobId });

        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not found',
            });
        }

        return res.json({
            success: true,
            data: {
                jobId: job.jobId,
                status: job.status,
                progress: job.progress,
                tool: job.tool,
                error: job.error,
                createdAt: job.createdAt,
                downloadUrl: job.status === 'completed' ? `/api/jobs/${jobId}/download` : undefined,
            },
        });
    } catch (error: any) {
        logger.error('Get job error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch job',
        });
    }
});

// Download result
router.get('/:jobId/download', async (req: Request, res: Response) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findOne({ jobId });

        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not found',
            });
        }

        if (job.status !== 'completed') {
            return res.status(400).json({
                success: false,
                error: 'Job not completed yet',
            });
        }

        if (!job.outputFile || !fs.existsSync(job.outputFile.path)) {
            return res.status(404).json({
                success: false,
                error: 'Output file not found',
            });
        }

        res.download(job.outputFile.path, job.outputFile.filename);
    } catch (error: any) {
        logger.error('Download error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Download failed',
        });
    }
});

// Get all jobs (for authenticated user or guest session)
router.get('/', async (req: Request, res: Response) => {
    try {
        // In production, filter by userId from JWT
        // For now, return recent jobs
        const jobs = await Job.find()
            .sort({ createdAt: -1 })
            .limit(50)
            .select('-__v');

        return res.json({
            success: true,
            data: jobs,
        });
    } catch (error: any) {
        logger.error('Get jobs error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch jobs',
        });
    }
});

// Delete job
router.delete('/:jobId', async (req: Request, res: Response) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findOne({ jobId });

        if (!job) {
            return res.status(404).json({
                success: false,
                error: 'Job not found',
            });
        }

        // Delete files
        if (job.outputFile && fs.existsSync(job.outputFile.path)) {
            fs.unlinkSync(job.outputFile.path);
        }

        job.inputFiles.forEach((file) => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });

        await Job.deleteOne({ jobId });

        logger.info(`Deleted job: ${jobId}`);

        res.json({
            success: true,
            message: 'Job deleted',
        });
    } catch (error: any) {
        logger.error('Delete job error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to delete job',
        });
    }
});

export default router;
