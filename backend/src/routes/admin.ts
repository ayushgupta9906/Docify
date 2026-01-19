import { Router, Request, Response } from 'express';
import { Job } from '../models/Job.model';
import { logger } from '../utils/logger';

const router = Router();

// Admin login (simple hardcoded auth - enhance with bcrypt/JWT later)
router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    // Default credentials: admin/admin123
    if (username === 'admin' && password === 'admin123') {
        const token = 'admin-token-' + Date.now();
        res.json({ success: true, data: { token } });
    } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
});

// Dashboard statistics
router.get('/stats', async (req: Request, res: Response) => {
    try {
        const totalJobs = await Job.countDocuments();
        const completed = await Job.countDocuments({ status: 'completed' });
        const failed = await Job.countDocuments({ status: 'failed' });
        const processing = await Job.countDocuments({ status: 'processing' });

        const byTool = await Job.aggregate([
            { $group: { _id: '$tool', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const recent = await Job.find()
            .sort({ createdAt: -1 })
            .limit(20)
            .select('tool status createdAt inputFiles');

        res.json({
            success: true,
            data: {
                totalJobs,
                completed,
                failed,
                processing,
                byTool,
                recent
            }
        });
    } catch (error: any) {
        logger.error('Admin stats error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
