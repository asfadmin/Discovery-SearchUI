import { Injectable } from '@angular/core';
import { beta } from '@models';

@Injectable({
  providedIn: 'root'
})
export class FrameMapService {
  public datasets = [beta];
  constructor() { }

  public downloadFrameMap(id: string): void {
    console.log('Downloading frame map for', id);
    this.datasets.forEach((dataset) => {dataset.id === id ? this.downloadFileFromUrl(dataset.frameMap.ascending, dataset.name) : null;});
  }

  //  /**
  //   * Opens the user's system file dialog prompting to download
  //   * the given data.
  //   *
  //   * @param fileName default name of the saved file. This is what will show up as file name in the user's file dialog.
  //   * @param data the content of the file.
  //   * @param mime
  //   * @param bom
  //   */
  // private download(
  //   fileName: string,
  //   data: string | ArrayBuffer | ArrayBufferView | Blob,
  //   mime = 'application/json',
  //   bom?: string | Uint8Array,
  // ) {
  //   const blobData = bom === undefined ? [data] : [bom, data]
  //   const blob = new Blob(blobData, { type: mime })
  //   const a = document.createElement("a")
  //
  //   a.download = fileName
  //   a.href = URL.createObjectURL(blob)
  //   a.click()
  //   setTimeout(() => {
  //     URL.revokeObjectURL(a.href)
  //     a.remove()
  //   }, 200)
  // }

  async downloadFileFromUrl(url: string, fileName: string): Promise<void> {
    console.log('Downloading from URL:', url);
    console.log('File name:', fileName);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const dataUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(dataUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }


}
