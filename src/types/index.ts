// Job and Processing Types
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type ToolType = string;

export interface Job {
    _id?: string;
    jobId: string;
    userId?: string;
    status: JobStatus;
    tool: ToolType;
    inputFiles: FileMetadata[];
    outputFile?: FileMetadata;
    options?: ProcessingOptions;
    progress?: number;
    error?: string;
    createdAt: Date;
    updatedAt?: Date;
    expiresAt: Date;
}

export interface FileMetadata {
    filename: string;
    originalName: string;
    path: string;
    size: number;
    mimeType: string;
    uploadedAt?: Date;
}

export interface ProcessingOptions {
    // Compression
    quality?: 'low' | 'medium' | 'high';

    // Split
    splitType?: 'range' | 'fixed';
    ranges?: string; // e.g., "1-5,7,9-12"
    pagesPerFile?: number;

    // Rotation
    rotation?: 90 | 180 | 270;
    pages?: number[]; // which pages to rotate

    // Security
    password?: string;
    ownerPassword?: string;
    permissions?: {
        printing?: boolean;
        modifying?: boolean;
        copying?: boolean;
    };

    // Watermark
    watermarkText?: string;
    watermarkImage?: string;
    watermarkPosition?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    watermarkOpacity?: number;

    // Page Numbers
    numberFormat?: string;
    numberPosition?: 'header' | 'footer';
    startNumber?: number;

    // Page Operations
    pageOrder?: number[];
    pagesToDelete?: number[];

    // OCR
    language?: string;
}

export interface BatchJob {
    batchId: string;
    jobs: string[]; // array of jobIds
    status: JobStatus;
    completedCount: number;
    totalCount: number;
    tool: ToolType;
    createdAt: Date;
    outputZip?: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface UploadResponse {
    fileId: string;
    filename: string;
    size: number;
    mimeType: string;
}

export interface JobResponse {
    jobId: string;
    status: JobStatus;
    progress?: number;
    downloadUrl?: string;
    error?: string;
}

export interface ToolCardData {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: string;
    href: string;
    color: string;
}
