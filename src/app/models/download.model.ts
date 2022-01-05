export interface DownloadStatus {
    content: Blob | null;
    progress: number;
    state: 'PENDING' | 'IN_PROGRESS' | 'DONE';
    id: string;
    filename: string;
}
