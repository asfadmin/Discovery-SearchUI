import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

import { EnvironmentService } from '@services/environment.service';
import { CMRProduct, SarviewsProduct } from '@models';

@Injectable({
  providedIn: 'root'
})
export class BulkDownloadService {
  constructor(
    private http: HttpClient,
    private env: EnvironmentService,
  ) {}

  private get url(): string {
    return this.env.currentEnv.bulk_download;
  }
  public downloadCMRProductsScript$(products: CMRProduct[]): Observable<HttpResponse<Blob>> {
    const productsStr = products
    .map(product => product.downloadUrl)
    .join(',');

    return this.downloadScript$(productsStr);
  }
  public downloadSarviewsProductsScript$(products: SarviewsProduct[]): Observable<HttpResponse<Blob>> {
    const productsStr = products
    .map(product => product.files.product_url)
    .join(',');

    return this.downloadScript$(productsStr);
  }
  public downloadScript$(productsListStr: string) {

    const formData = new FormData();
    formData.append('products', productsListStr);

    return this.http.post<Blob>(this.url, formData, {
      responseType: 'blob' as 'json',
      observe: 'response'
    });
  }
}
