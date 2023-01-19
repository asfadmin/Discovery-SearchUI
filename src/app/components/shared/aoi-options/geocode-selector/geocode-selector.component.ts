import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WktService } from '@services';
import { debounceTime, map, Observable, Subject } from 'rxjs';
import {Vector as VectorSource} from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { SubSink } from 'subsink';
import { AppState } from '@store';
import { Store } from '@ngrx/store';
import { getGeocodeArea } from '@store/filters';

@Component({
  selector: 'app-geocode-selector',
  templateUrl: './geocode-selector.component.html',
  styleUrls: ['./geocode-selector.component.scss']
})
export class GeocodeSelectorComponent implements OnInit {
  private key = 'bFwkahiCrAA0526OlsHS';
  public options = [];
  public search_key = '';
  public subject = new Subject();
  public results$ = new Observable();


  private vectorSource;

  private subs = new SubSink();
  @Output() geocodeWkt = new EventEmitter();
  constructor(private http: HttpClient,
    private wkt: WktService,
    private store$: Store<AppState>
    ) { }

  ngOnInit(): void {
    this.results$ = this.subject.pipe(
      debounceTime(200),
      map((geocodeText: string) => this.http.get(`https://api.maptiler.com/geocoding/${encodeURIComponent(geocodeText)}.json?key=${this.key}`)));

    this.subs.add(
      this.store$.select(getGeocodeArea).subscribe(
        (value) => {
          this.search_key = value;
        }
      )
    )

  this.results$.subscribe((value: Observable<any>) => {
    value.subscribe((res) => {
      this.options = res['features'].map(feature => ({'name': feature['place_name_en'], 'id': feature['id']}))
      this.vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(res),
      });
    })
  })
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
    let feature = this.vectorSource.getFeatures().find(feat => feat.getId() === option.id)
    let wktFeature = this.wkt.featureToWkt(feature,'EPSG:4326')
    this.geocodeWkt.emit({wkt: wktFeature, geocode: option.name});
  }

}
