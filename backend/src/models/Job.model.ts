import mongoose, { Schema, Document } from 'mongoose';

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface IJob extends Document {
    jobId: string;
    userId?: string;
    status: JobStatus;
    tool: string;
    inputFiles: {
        filename: string;
        originalName: string;
        path: string;
        size: number;
        mimeType: string;
    }[];
    outputFile?: {
        filename: string;
        path: string;
        size: number;
    };
    options?: any;
    progress?: number;
    error?: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
}

const JobSchema: Schema = new Schema(
    {
        jobId: { type: String, required: true, unique: true, index: true },
        userId: { type: String, index: true },
        status: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'failed'],
            default: 'pending',
            index: true,
        },
        tool: { type: String, required: true },
        inputFiles: [
            {
                filename: String,
                originalName: String,
                path: String,
                size: Number,
                mimeType: String,
            },
        ],
        outputFile: {
            filename: String,
            path: String,
            size: Number,
        },
        options: Schema.Types.Mixed,
        progress: { type: Number, default: 0 },
        error: String,
        expiresAt: { type: Date, required: true, index: true },
    },
    {
        timestamps: true,
    }
);

// Auto-delete expired jobs
JobSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Job = mongoose.model<IJob>('Job', JobSchema);
