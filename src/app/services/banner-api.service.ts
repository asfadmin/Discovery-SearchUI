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
      banners: [
        {
          text:
            '<p>' +
            'ASF is currently experiencing technical issues that are preventing users who have ' +
            'not recently downloaded data from obtaining data from the datapool. ' +
            'ASF is working to resolve this issue and will have download services restored ' +
            'as soon as possible. ' +
            '</p><p>' +
            'Looking for the old Vertex design?' +
            'It will remain available ' +
            '<a href="https://vertex-retired.daac.asf.alaska.edu">here</a> until August 19, 2019' +
            '</p>'
          ,
          type: 'message',
          target: [
            'sar-search'
          ]
        }
      ],
      systime: ''
    });
  }
}
