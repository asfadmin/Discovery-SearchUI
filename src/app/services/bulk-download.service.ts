import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CMRProduct } from '@models';
import { EnvironmentService } from '@services/environment.service';

@Injectable({
  providedIn: 'root',
})
export class BulkDownloadService {
  private http = inject(HttpClient);
  private env = inject(EnvironmentService);

  private get url(): string {
    return this.env.currentEnv.bulk_download;
  }
  public downloadCMRProductsScript$(
    products: CMRProduct[],
  ): Observable<HttpResponse<Blob>> {
    const productsStr = products
      .map((product) => product.downloadUrl)
      .join(',');

    return this.downloadScript$(productsStr);
  }
  public downloadScript$(productsListStr: string) {
    const formData = new FormData();
    formData.append('products', productsListStr);

    return this.http.post<Blob>(this.url, formData, {
      responseType: 'blob' as 'json',
      observe: 'response',
    });
  }
}
