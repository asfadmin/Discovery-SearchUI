import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BrowseOverlayService, WktService } from '@services';
import { Observable, first, map, tap } from 'rxjs';
// import WebGLTileLayer from 'ol/layer/WebGLTile';
import ImageLayer from 'ol/layer/Image';
// import Static from 'ol/source/ImageStatic';
import { LonLat, TimeSeriesResult } from '@models';
import ImageSource from 'ol/source/Image';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';

@Injectable({
  providedIn: 'root'
})
export class NetcdfServiceService {
  private url: string = 'http://127.0.0.1:8080/'
  private itemsEndpoint: string = 'items/'
  private timeSeriesEndpoint: string = 'timeseries'
  private files: string[] = ["20221107_20230518.unw.nc"] //, "20221107_20230130.unw.nc", "20221107_20230106.unw.nc", "20221107_20230729.unw.nc", "20221107_20230319.unw.nc", "20221107_20221213.unw.nc", "20221107_20230530.unw.nc", "20221107_20230717.unw.nc", "20221107_20230412.unw.nc", "20221107_20230506.unw.nc", "20221107_20230223.unw.nc", "20221107_20230211.unw.nc", "20221107_20230331.unw.nc", "20221107_20230705.unw.nc"]
  public layers: {feature: Feature<Geometry>, browse: ImageLayer<ImageSource>}[] = []
  // private data = []
  constructor(
    private http: HttpClient,
    private browseOverlayService: BrowseOverlayService,
    // private mapService: MapService
    private wktService: WktService

  ) {
  }

  public get_layers(): Observable<{feature: Feature<Geometry>, browse: ImageLayer<ImageSource>}>[] {
    let output: Observable<{feature: Feature<Geometry>, browse: ImageLayer<ImageSource>}>[] = []
    for (let file of this.files) {
      output.push(
        this.http.get(`${this.url}${this.itemsEndpoint}${file}/wkt`, {
          withCredentials: false,
        }).pipe(
          map(wkt_response => {
            const wkt = wkt_response['wkt']
            const feature = this.wktService.wktToFeature(wkt, 'EPSG:3857');
            // const polygon = this.browseOverlayService.getPolygonFromFeature(feature, wkt);
            return {feature, browse: this.browseOverlayService.createNormalImageLayer(`${this.url}${this.itemsEndpoint}${file}/layers/unwrapped_phase`, wkt, 'ol-layer', 'current-overlay')}
          }
            // this.browseOverlayService.createGeotiffLayer(response, wkt_response['wkt'], 'ol-layer', 'current-overlay')
          ),
          first(),
          tap(output => {
            console.log(output.browse);
            output.browse.set('file', this.files[0]);

            // browseImageLayer.on('select', (_) => console.log(browseImageLayer.get('file')))
          })),
      )
    }

    return output
  }

  // public getGeotiffLayers() {
  //   for (let layer of this.get_layers()) {
  //     layer.pipe(tap(l => {
  //       l.set('netcdf-layer', true);
  //       l.set('selectable', true);
  //       this.mapService.addLayer(l);
  //   })).subscribe(l => this.layers.push(l))
  //   }
  // }

  public getTimeSeries(coords: LonLat) {
    return this.http.get(`${this.url}${this.timeSeriesEndpoint}?layer=unwrapped_phase&x=${coords.lat}&y=${coords.lon}`, {responseType: 'json'}).pipe(first(),
  ).pipe(
    map(response => response as TimeSeriesResult),
  )
  }
}