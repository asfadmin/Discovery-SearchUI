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
    value.subscribe((a) => {
      this.options = a['features'].map(thing => thing['place_name_en'])
      this.vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(a),
      });
    })
  })
  }
  public onChange(a) {
    this.subject.next(a);
  }

  public onSelect(option) {
    this.search_key = option;
    let i = this.options.findIndex((a) => a === option)
    let wktFeature = this.wkt.featureToWkt(this.vectorSource.getFeatures()[i],'EPSG:4326')
    this.geocodeWkt.emit({wkt: wktFeature, geocode: option});
  }

}
