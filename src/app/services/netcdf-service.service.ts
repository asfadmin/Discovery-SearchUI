import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BrowseOverlayService, MapService } from '@services';
import { Observable, first, map, tap } from 'rxjs';
// import WebGLTileLayer from 'ol/layer/WebGLTile';
import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';

@Injectable({
  providedIn: 'root'
})
export class NetcdfServiceService {
  private url: string = 'http://127.0.0.1:8000/items/'
  private files: string[] = ["20221107_20230518.unw.nc"] //, "20221107_20230130.unw.nc", "20221107_20230106.unw.nc", "20221107_20230729.unw.nc", "20221107_20230319.unw.nc", "20221107_20221213.unw.nc", "20221107_20230530.unw.nc", "20221107_20230717.unw.nc", "20221107_20230412.unw.nc", "20221107_20230506.unw.nc", "20221107_20230223.unw.nc", "20221107_20230211.unw.nc", "20221107_20230331.unw.nc", "20221107_20230705.unw.nc"]
  public layers: ImageLayer<Static>[] = []
  // private data = []
  constructor(
    private http: HttpClient,
    private browseOverlayService: BrowseOverlayService,
    private mapService: MapService

  ) {
  }

  private get_layers() {
    let output: Observable<ImageLayer<Static>>[] = []
    for (let file of this.files) {
      output.push(
        this.http.get(`${this.url}${file}/wkt`, {
          withCredentials: false,
        }).pipe(
          map(wkt_response =>
            this.browseOverlayService.createImageLayer(`${this.url}${file}/layers/unwrapped_phase`, wkt_response['wkt'], 'ol-layer', 'current-overlay')
            // this.browseOverlayService.createGeotiffLayer(response, wkt_response['wkt'], 'ol-layer', 'current-overlay')
          ),
            first(),
            tap(browseImageLayer => console.log(browseImageLayer))),
        )
    }

    return output
  }

  public getGeotiffLayers() {
    for (let layer of this.get_layers()) {
      layer.pipe(tap(l => this.mapService.addLayer(l))).subscribe(l => this.layers.push(l))
    }
  }
}