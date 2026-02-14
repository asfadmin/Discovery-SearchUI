import { inject, Injectable, signal } from '@angular/core';
import { catchError, filter, first, from, of } from 'rxjs';
import * as xml2js from 'xml2js';
import { HttpClient, HttpContext } from '@angular/common/http';
import { boundingExtent, Extent } from 'ol/extent';
// import { AuthService } from './auth.service';
// import { EnvironmentService } from './environment.service';
@Injectable({
  providedIn: 'root',
})
export class KmlFootprintService {
  private httpClient = inject(HttpClient);
  //   private authService = inject(AuthService);
  //   private env = inject(EnvironmentService);
  public KMLFootPrint$ = signal<{ extent: Extent; rotation: number }>(null);
  public L2Browse: string;
  public readExtentFromKML(
    // _scene_name: string,
    kml_url: string,
    kmlBrowse?: string,
  ): void {
    this.L2Browse = kmlBrowse;
    this.httpClient
      .get(
        kml_url,
        // `
        // ${this.env.currentEnv.api}/services/utils/kml_footprint?granule=${scene_name}&maturity=test&cmr_token=${this.authService.getToken()}
        // `,
        {
          withCredentials: true,
          //   context: HttpContext use this to handle triggering interceptor
          observe: 'events',
          responseType: 'blob',
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

        observable
          .pipe(
            filter((f) => !!f),
            first(),
          )
          .subscribe((result) => {
            const coordinatesString =
              result['kml'].Document.GroundOverlay['ns0:LatLonQuad']
                .coordinates;
            const coordinates: number[][] = coordinatesString
              .split(' ')
              .map((latlon) => {
                const temp = latlon.split(',');
                return temp.map((coord) => parseFloat(coord)) as number[];
              });
            const extent = boundingExtent(coordinates);
            console.log(extent);
            let rotation = 0.0;
            const coord0 = coordinates[0];
            const coord1 = coordinates[1];

            if (coord0.length > 0 && coord1.length > 0) {
              const bottomLeft = [extent[0], extent[1]];

              const distToBottomLeft = coordinates.map((coordinate) =>
                Math.sqrt(
                  (coordinate[0] - bottomLeft[0]) ** 2 +
                    (coordinate[1] - bottomLeft[1]) ** 2,
                ),
              );

              let minimum = 1000;
              let minimumIdx = 0;
              for (
                let distanceIdx = 0;
                distanceIdx < distToBottomLeft.length - 1;
                distanceIdx++
              ) {
                if (distToBottomLeft[distanceIdx] < minimum) {
                  minimumIdx = distanceIdx;
                  minimum = distToBottomLeft[distanceIdx];
                }
              }
              // const minIdx = distToTopLeft.findIndex();
              // const x1 = coord0[0];
              // const x2 = coord0[0];
              // const y1 = coord0[1];
              // const y2 = coord1[1];

              // if (minimumIdx > 0) {
              // rotation = -(minimumIdx * 90 * Math.PI) / 180; // (1 + minimumIdx * Math.PI) / 2;
              // }
              console.log('DISTANCE TO BOTTOM LEFT');
              console.log(distToBottomLeft);
              console.log(minimumIdx);
              if (minimumIdx == 1) {
                rotation = Math.PI / 2;
              } else if (minimumIdx == 2) {
                rotation = -Math.PI / 2;
              }
            }

            this.KMLFootPrint$.set({ extent, rotation });
          });
      });
  }
}
