import { CMRProduct } from './cmr-product.model';

export interface DownloadStatus {
    progress: number;
    state: 'PENDING' | 'IN_PROGRESS' | 'SAVING' | 'DONE';
    id: string;
    filename: string;
    product: CMRProduct;
}
