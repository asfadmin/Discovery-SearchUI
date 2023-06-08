import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MapService, WktService } from '@services';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import {transformExtent} from 'ol/proj';

import { SubSink } from 'subsink';
import { AppState } from '@store';
import { Store } from '@ngrx/store';
import { getGeocodeArea } from '@store/filters';
import { Feature } from 'ol';

@Component({
  selector: 'app-geocode-selector',
  templateUrl: './geocode-selector.component.html',
  styleUrls: ['./geocode-selector.component.scss']
})
export class GeocodeSelectorComponent implements OnInit, OnDestroy {
  @Output() geocodeWkt = new EventEmitter();
  public options = [];
  public search_key = '';
  public subject = new Subject();

  private vectorSource: VectorSource;

  private subs = new SubSink();

  constructor(private http: HttpClient,
    private wkt: WktService,
    private store$: Store<AppState>,
    private mapService: MapService
  ) { }

  ngOnInit(): void {
    const token = 'pk.eyJ1IjoiYXNmLWRpc2NvdmVyeSIsImEiOiJjbGkxaGlzbG4wMWl2M3RvMzF3MTZzYmZwIn0.07e8Inyq9w9DdBG5U1BZwg';

    this.subs.add(
      this.subject.pipe(
        debounceTime(500),
        switchMap((geocodeText: string) => this.http.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(geocodeText)}.json?access_token=${token}`
        ))
      ).subscribe(res => {
          this.options = res['features'].map(
            (feature: any) => ({
              'name': feature['place_name'],
              'id': feature['id'],
              'bbox': feature['bbox']
            }));

          this.vectorSource = new VectorSource({
            features: new GeoJSON().readFeatures(res),
          });
        })
    )

    this.subs.add(
      this.store$.select(getGeocodeArea).subscribe(
        (value) => {
          this.search_key = value;
        }
      )
    )
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public onChange(option) {
    this.search_key = option && (option.name ?? option);
    this.subject.next(this.search_key);
  }

  public displayFunc(option) {
    return option && (option.name ?? option);
  }

  public onSelect(option) {
    this.search_key = option.name;
    let feature: Feature = this.vectorSource.getFeatures().find(feat => feat.getId() === option.id);

    let zoomExtent = transformExtent(feature.getGeometry().getExtent(), 'EPSG:4326', this.mapService.epsg());
    this.mapService.zoomToExtent(zoomExtent);

    let wktFeature = this.wkt.featureToWkt(feature, 'EPSG:4326');
    this.geocodeWkt.emit({ wkt: wktFeature, geocode: option.name });
  }

}
