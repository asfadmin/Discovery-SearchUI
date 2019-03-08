import { async, fakeAsync, tick, TestBed, inject } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';

import { cold, getTestScheduler } from 'jasmine-marbles';

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


describe('UrlStateService', () => {
  let service: UrlStateService;
  let store: TestStore<AppState>;
  let routerNavigateSpy;
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

  beforeEach(inject([Router], (testRouter: TestRouter) => {
    routerNavigateSpy = spyOn(testRouter, 'navigate');
  }));

  it('should run #load()', () => {
    getTestScheduler().flush();
    service.load();
    expect(routerNavigateSpy).toHaveBeenCalled();

    // TODO: Write more indepth tests!
  });
});

class TestMapService {
  // TODO: These observables should be dynamic based on test
  public zoom$ = cold('-vv', {v: 5});
  public center$ = cold('-vv', {v: {lon: 10, lat: 10}});
  public epsg$ = new BehaviorSubject<string>('EPSG');
  public searchPolygon$ = new BehaviorSubject<string | null>(null);
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
  public queryParams = cold('-q', {zoom: '1'});
}
