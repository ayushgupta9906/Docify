import axios from 'axios';
import type { ApiResponse, JobResponse, UploadResponse, Job, BatchJob } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-one-ashy-30.vercel.app/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token if it exists
apiClient.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const api = {
    // Upload files
    uploadFiles: async (files: File[]): Promise<UploadResponse[]> => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        const { data } = await apiClient.post<ApiResponse<UploadResponse[]>>(
            '/upload',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Upload failed');
        }

        return data.data;
    },

    // Process files
    processTool: async (
        tool: string,
        fileIds: string[],
        options?: any
    ): Promise<JobResponse> => {
        const { data } = await apiClient.post<ApiResponse<JobResponse>>(
            `/process/${tool}`,
            {
                fileIds,
                options,
            }
        );

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Processing failed');
        }

        return data.data;
    },

    // Get job status
    getJobStatus: async (jobId: string): Promise<Job> => {
        const { data } = await apiClient.get<ApiResponse<Job>>(`/jobs/${jobId}`);

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch job');
        }

        return data.data;
    },

    // Download result
    downloadResult: async (jobId: string): Promise<Blob> => {
        const { data } = await apiClient.get(`/jobs/${jobId}/download`, {
            responseType: 'blob',
        });

        return data;
    },

    // Get user's jobs
    getJobs: async (): Promise<Job[]> => {
        const { data } = await apiClient.get<ApiResponse<Job[]>>('/jobs');

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch jobs');
        }

        return data.data;
    },

    // Batch processing
    processBatch: async (
        tool: string,
        fileIds: string[],
        options?: any
    ): Promise<BatchJob> => {
        const { data } = await apiClient.post<ApiResponse<BatchJob>>('/batch', {
            tool,
            fileIds,
            options,
        });

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Batch processing failed');
        }

        return data.data;
    },

    getBatchStatus: async (batchId: string): Promise<BatchJob> => {
        const { data } = await apiClient.get<ApiResponse<BatchJob>>(`/batch/${batchId}`);

        if (!data.success || !data.data) {
            throw new Error(data.error || 'Failed to fetch batch');
        }

        return data.data;
    },

    downloadBatchResult: async (batchId: string): Promise<Blob> => {
        const { data } = await apiClient.get(`/batch/${batchId}/download`, {
            responseType: 'blob',
        });

        return data;
    },
};
