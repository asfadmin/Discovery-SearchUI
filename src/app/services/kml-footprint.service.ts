import { inject, Injectable, signal } from '@angular/core';
import { catchError, first, from, of } from 'rxjs';
import * as xml2js from 'xml2js';
import { HttpClient } from '@angular/common/http';
import { boundingExtent, Extent } from 'ol/extent';
import { AuthService } from './auth.service';
import { EnvironmentService } from './environment.service';
@Injectable({
  providedIn: 'root',
})
export class KmlFootprintService {
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);
  private env = inject(EnvironmentService);
  public KMLFootPrint$ = signal<Extent>(null);
  public L2Browse: string;
  public readExtentFromKML(scene_name: string, kmlBrowse?: string): void {
    this.L2Browse = kmlBrowse;
    this.httpClient
      .get(
        `
        ${this.env.currentEnv.api}/services/utils/kml_footprint?granule=${scene_name}&maturity=test&cmr_token=${this.authService.getToken()}
        `,
        {
          headers: {
            'Content-Type': 'text/html',
            Accept: 'text/html',
          },
          responseType: 'text',
        },
      )
      .pipe(
        catchError((rr) => {
          console.log(rr);
          return of(
            `
          <kml xmlns:ns0="http://www.google.com/kml/ext/2.2">
            <Document>
                <name>overlay image</name>
                <GroundOverlay>
                <name>overlay image</name>
                <Icon>
                    <href>NISAR_L2_PR_GCOV_088_039_D_114_2005_SHSH_A_20251114T222008_20251114T222017_T05000_N_P_J_001.png</href>
                </Icon>
                <ns0:LatLonQuad>
                    <coordinates>-69.57891146545717,-52.60995484564826 -64.62012180281641,-52.53029189101861 -64.88826861554126,-49.605377060113724 -69.54334533691589,-49.677172669908224</coordinates>
                </ns0:LatLonQuad>
                </GroundOverlay>
            </Document>
            </kml>';
        `,
          );
          //   return throwError(
          //     () => new Error('Something bad happened; please try again later.'),
          //   );
        }),
      )
      .subscribe((xmlFile) => {
        const parser = new xml2js.Parser({ explicitArray: false });
        const observable = from(
          parser.parseStringPromise(xmlFile).catch((__) => {
            // Do nothing
          }),
        );

        observable.pipe(first()).subscribe((result) => {
          const coordinatesString =
            result['kml'].Document.GroundOverlay['ns0:LatLonQuad'].coordinates;
          const coordinates: [][] = coordinatesString
            .split(' ')
            .map((latlon) => {
              const temp = latlon.split(',');
              return temp.map((coord) => parseFloat(coord));
            });
          const extent = boundingExtent(coordinates);
          console.log(extent);
          this.KMLFootPrint$.set(extent);
        });
      });
  }
}
