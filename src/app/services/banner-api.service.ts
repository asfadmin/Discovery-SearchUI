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
        text: 'ASF is aware of intermittent data availability which is affecting our users. Service degradation is currently the result of ISP fiber optic maintenance. We apologize for any inconvenience. Please feel free to contact us at <a href="mailto:uso@asf.alaska.edu" target="_blank">uso@asf.alaska.edu</a> if you have any questions.',
        type: '',
        target: []
      }],
      systime: ''
    });
  }
}
