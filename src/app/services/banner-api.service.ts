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
        text: 'This is a test <b>bannder</b>!' ,
        type: 'message',
        target: [
          'vertex'
        ]
      }, {
        text: 'MAKE THIS LOOK NICE...' ,
        type: 'alert',
        target: [
          'vertex'
        ]
      }],
      systime: ''
    });
  }
}
