import { async, TestBed, inject } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import { TestStore } from '@testing/services';
import { defaultAppState } from '@testing/data';
import * as models from '@models';

import { UrlStateService } from './url-state.service';
import { MapService } from './map/map.service';
import { WktService } from './wkt.service';
import { RangeService } from './range.service';


class TestMapService {
  public zoom$ = new BehaviorSubject<number>(5);
  public center$ = new BehaviorSubject<models.LonLat>({lon: 10, lat: 10});
  public epsg$ = new BehaviorSubject<string>('EPSG');
  public searchPolygon$ = new BehaviorSubject<string>('wkt here...');
  public mousePosition$ = new BehaviorSubject<models.LonLat>({
    lon: 0, lat: 0
  });

  public setZoom(zoom) {}

  public setCenter() {}

  public epsg() { return 'EPSG'; }

  public setDrawFeature(feature) {}
}

class TestRouter {
 public navigate(_, __) {}
}

class TestActivatedRoute {
  public queryParams = new BehaviorSubject<string>('');
}

fdescribe('UrlStateService', () => {
  let service: UrlStateService;
  let store: TestStore<AppState>;
  let dispatchSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UrlStateService,
        WktService,
        RangeService,
        { provide: MapService, useClass: TestMapService },
        { provide: Store, useClass: TestStore },
        { provide: Router, useClass: TestRouter },
        { provide: ActivatedRoute, useClass: TestActivatedRoute },
      ]
    });

    service = TestBed.get(UrlStateService);
  });

  beforeEach(inject([Store], (testStore: TestStore<AppState>) => {
    store = testStore;
    dispatchSpy = spyOn(store, 'dispatch');
    store.setState(defaultAppState);
  }));

  it('should run #load()', async () => {
    // load();
  });
});
