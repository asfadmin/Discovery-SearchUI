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
        text: "Welcome to ASF's new SAR search application, featuring a redesigned interface, improved search capabilities, and quicker access to data.  The retired Vertex application will remain available at <a href='https://vertex-retired.daac.asf.alaska.edu'>https://vertex-retired.daac.asf.alaska.edu</a> until August 19, 2019.",
        type: 'message',
        target: [
          'sar-search'
        ]
      }],
      systime: ''
    });
  }
}
