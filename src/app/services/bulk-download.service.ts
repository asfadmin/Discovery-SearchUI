import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { CMRProduct } from '@models';

@Injectable({
  providedIn: 'root'
})
export class BulkDownloadService {
  private readonly url = 'https://bulk-download.asf.alaska.edu';
  private readonly testUrl = 'https://bulk-download-test.asf.alaska.edu';

  constructor(private http: HttpClient) {}

  public downloadScript$(products: CMRProduct[]): Observable<any> {
    const productsStr = products
      .map(product => product.downloadUrl)
      .join(',');

    const formData = new FormData();
    formData.append('products', productsStr);

    return this.http.post(this.testUrl, formData, {
      responseType: 'blob',
    });
  }
}
