import { inject, Injectable, signal } from '@angular/core';
import { catchError, first, from, of } from 'rxjs';
import * as xml2js from 'xml2js';
// import { Polygon } from 'ol/geom';
import { HttpClient } from '@angular/common/http';
import { boundingExtent, Extent } from 'ol/extent';
@Injectable({
  providedIn: 'root',
})
export class KmlFootprintService {
  private httpClient = inject(HttpClient);
  public KMLFootPrint$ = signal<Extent>(null);

  public readExtentFromKML(kml_url: string): void {
    this.httpClient
      .post(
        kml_url,
        {},
        {
          //   responseType: 'text',
          // observe: 'response',
          //   mode: 'no-cors',
          redirect: 'error',
          credentials: 'include',
          // credentials: 'include',
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
      .subscribe((blob) => {
        const filereader = new FileReader();

        filereader.onload = (_) => {
          const res = filereader.result as string;
          const parser = new xml2js.Parser({ explicitArray: false });
          const observable = from(
            parser.parseStringPromise(res).catch((__) => {
              // Do nothing
            }),
          );

          observable.pipe(first()).subscribe((result) => {
            const coordinatesString =
              result['kml'].Document.GroundOverlay['ns0:LatLonQuad']
                .coordinates;
            const coordinates: [][] = coordinatesString
              .split(' ')
              .map((latlon) => {
                const temp = latlon.split(',');
                return temp.map((coord) => parseFloat(coord));
              });

            // coordinates.push(coordinates[0]);

            // const geomtry = new Polygon(coordinates);
            
            const extent = boundingExtent(coordinates);
            console.log(extent);
            this.KMLFootPrint$.set(extent);

            // const files: [] = result?.['metalink']?.['files']?.['file'];
            // const fileNames = files.map((fileMeta) =>
            //   (fileMeta?.['$']?.['name'] as string)?.split('.')?.shift(),
            // );

            // this.updateSearchList(fileNames);
          });
        };

        // const body = blob.body;
        console.log(blob);
        if (typeof blob === 'string') {
          blob = new Blob([blob]);
        }
        filereader.readAsText(blob as any);
      });
  }
}
