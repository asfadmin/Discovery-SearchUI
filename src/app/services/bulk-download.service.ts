import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { EnvironmentService } from '@services/environment.service';
import { CMRProduct } from '@models';

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

  public downloadScript$(products: CMRProduct[]): Observable<any> {
    const productsStr = products
      .map(product => product.downloadUrl)
      .join(',');

    const formData = new FormData();
    formData.append('products', productsStr);

    return this.http.post(this.url, formData, {
      responseType: 'blob',
      observe: 'response'
    });
  }
}
