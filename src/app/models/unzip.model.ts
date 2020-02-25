export interface UnzippedFolder {
  contents?: UnzippedFolder[];
  size?: number;
  url?: string;
  name: string;
  type: ContentType;
}

export type ContentType = 'dir' | 'file';
