import { Injectable } from '@angular/core';

import { beta } from '@models';

@Injectable({
  providedIn: 'root',
})
export class FrameMapService {
  public datasets = [beta];

  public downloadFrameMap(id: string): void {
    this.datasets.forEach((dataset) => {
      if (dataset.id === id) {
        this.downloadFileFromUrl(dataset.frameMap.ascending, dataset.name);
      }
    });
  }

  /**
   * Downloads a file from a given URL and saves it with the specified file name.
   * @param url - The URL of the file to download.
   * @param fileName - The name to save the downloaded file as.
   *
   * NOTE: This will fail when run locally with a cross-origin request error.
   * It is intended to be used in a production environment where the URL is accessible.
   */
  async downloadFileFromUrl(url: string, fileName: string): Promise<void> {
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
