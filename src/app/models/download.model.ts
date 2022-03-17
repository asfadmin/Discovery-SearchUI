import { CMRProduct } from './cmr-product.model';

export interface DownloadStatus {
    progress: number;
    state: 'PENDING' | 'IN_PROGRESS' | 'DONE';
    id: string;
    filename: string;
    product: CMRProduct;
}
