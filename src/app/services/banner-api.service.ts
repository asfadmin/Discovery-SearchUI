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
          Data will be unavailable due to system maintenance on September 24, 2019,
          starting at 3:00 am (AKST) and ending at 12:00 pm (AKST). We apologize for the
          inconvenience this disruption of service may cause to our customers. Please feel
          free to contact us at <a href="mailto:uso@asf.alaska.edu">uso@asf.alaska.edu</a>
          if you have any questions.
        `,
        type: 'Alert',
        target: []
      }],
      systime: ''
    });
  }
}
