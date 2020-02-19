export interface UnzippedFolder {
  contents: (UnzippedFile | UnzippedFolder)[];
  name: string;
  type: ContentType;
}

export interface UnzippedFile {
  name: string;
  size: number;
  type: ContentType;
  url: string;
}

export type ContentType = 'dir' | 'file';
