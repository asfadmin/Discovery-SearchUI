import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CMRProduct, UnzippedFolder } from '@models';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class UnzipApiService {
  constructor(
    private env: EnvironmentService,
    private http: HttpClient
  ) { }

  public get apiUrl() {
    return this.env.currentEnv.unzip;
  }

  public get datapool() {
    return this.env.currentEnv.datapool;
  }

  public canUnzip(product: CMRProduct): boolean {
    return true;
  }

  public unzip(downloadUrl: string): void {
    const productUnzipUrl = `${downloadUrl.replace('datapool', 'unzip')}/`;

    console.log(productUnzipUrl);
    this.http.get(productUnzipUrl, { withCredentials: true }).pipe(
      catchError(val => of(this.exampleResp()))
    ).subscribe(
      console.log
    );
  }

  private exampleResp(): UnzippedFolder {
    return {
      "contents": [
        {
          "contents": [
            {
              "name": "AP_27803_PLR_F0910_RT2.dem.tif",
              "size": 355859,
              "type": "file",
              "url": "https://unzip-test.asf.alaska.edu/RTC_LOW_RES/A3/AP_27803_PLR_F0910_RT2.zip/AP_27803_PLR_F0910_RT2/AP_27803_PLR_F0910_RT2.dem.tif"
            },
            {
              "name": "AP_27803_PLR_F0910_RT2.ls_map.tif",
              "size": 196943,
              "type": "file",
              "url": "https://unzip-test.asf.alaska.edu/RTC_LOW_RES/A3/AP_27803_PLR_F0910_RT2.zip/AP_27803_PLR_F0910_RT2/AP_27803_PLR_F0910_RT2.ls_map.tif"
            },
            {
              "name": "AP_27803_PLR_F0910_RT2.kmz",
              "size": 5991338,
              "type": "file",
              "url": "https://unzip-test.asf.alaska.edu/RTC_LOW_RES/A3/AP_27803_PLR_F0910_RT2.zip/AP_27803_PLR_F0910_RT2/AP_27803_PLR_F0910_RT2.kmz"
            },
            {
              "name": "AP_27803_PLR_F0910_RT2.iso.xml",
              "size": 101123,
              "type": "file",
              "url": "https://unzip-test.asf.alaska.edu/RTC_LOW_RES/A3/AP_27803_PLR_F0910_RT2.zip/AP_27803_PLR_F0910_RT2/AP_27803_PLR_F0910_RT2.iso.xml"
            },
            {
              "name": "AP_27803_PLR_F0910_RT2.geo.jpg",
              "size": 602666,
              "type": "file",
              "url": "https://unzip-test.asf.alaska.edu/RTC_LOW_RES/A3/AP_27803_PLR_F0910_RT2.zip/AP_27803_PLR_F0910_RT2/AP_27803_PLR_F0910_RT2.geo.jpg"
            },
            {
              "name": "AP_27803_PLR_F0910_RT2.geo.jpg.aux.xml",
              "size": 953,
              "type": "file",
              "url": "https://unzip-test.asf.alaska.edu/RTC_LOW_RES/A3/AP_27803_PLR_F0910_RT2.zip/AP_27803_PLR_F0910_RT2/AP_27803_PLR_F0910_RT2.geo.jpg.aux.xml"
            },
            {
              "name": "AP_27803_PLR_F0910_RT2.geo.wld",
              "size": 92,
              "type": "file",
              "url": "https://unzip-test.asf.alaska.edu/RTC_LOW_RES/A3/AP_27803_PLR_F0910_RT2.zip/AP_27803_PLR_F0910_RT2/AP_27803_PLR_F0910_RT2.geo.wld"
            },
            {
              "name": "AP_27803_PLR_F0910_RT2_HH.tif",
              "size": 9419521,
              "type": "file",
              "url": "https://unzip-test.asf.alaska.edu/RTC_LOW_RES/A3/AP_27803_PLR_F0910_RT2.zip/AP_27803_PLR_F0910_RT2/AP_27803_PLR_F0910_RT2_HH.tif"
            },
            {
              "name": "AP_27803_PLR_F0910_RT2_HV.tif",
              "size": 9323701,
              "type": "file",
              "url": "https://unzip-test.asf.alaska.edu/RTC_LOW_RES/A3/AP_27803_PLR_F0910_RT2.zip/AP_27803_PLR_F0910_RT2/AP_27803_PLR_F0910_RT2_HV.tif"
            },
            {
              "name": "AP_27803_PLR_F0910_RT2_VH.tif",
              "size": 9378537,
              "type": "file",
              "url": "https://unzip-test.asf.alaska.edu/RTC_LOW_RES/A3/AP_27803_PLR_F0910_RT2.zip/AP_27803_PLR_F0910_RT2/AP_27803_PLR_F0910_RT2_VH.tif"
            },
            {
              "name": "AP_27803_PLR_F0910_RT2_VV.tif",
              "size": 9358131,
              "type": "file",
              "url": "https://unzip-test.asf.alaska.edu/RTC_LOW_RES/A3/AP_27803_PLR_F0910_RT2.zip/AP_27803_PLR_F0910_RT2/AP_27803_PLR_F0910_RT2_VV.tif"
            }
          ],
          "name": "AP_27803_PLR_F0910_RT2",
          "type": "dir"
        }
      ]
    };
  }
}
