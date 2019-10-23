import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { BannerApiResponse } from '@models';

@Injectable({
  providedIn: 'root'
})
export class BannerApiService {

  constructor() { }

  public load(): Observable<BannerApiResponse> {
    return of({
      banners: [{
         text: `
           ASF is aware of intermittent data search errors and is actively
           working with several partner agencies to resolve the situation.
           If you require further assistance, please contact us at uso@asf.alaska.edu
         `,
         type: 'Alert',
         target: []
       }],
      systime: ''
    });
  }
}
