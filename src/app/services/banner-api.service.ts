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
            'Data availability will be intermittent due to system maintenance on August 3, 2019, ' +
            'starting at 03:00 (AKST) and ending 17:00 (AKST). We apologize for the inconvenience.' +
            '</p><p>' +
            'Looking for the old Vertex design?' +
            ' It will remain available ' +
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
