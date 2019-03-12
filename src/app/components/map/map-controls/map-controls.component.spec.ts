import { async, ComponentFixture, fakeAsync, TestBed, inject, tick } from '@angular/core/testing';

import { Store, StoreModule } from '@ngrx/store';
import * as appStore from '@store';

import { MapControlsComponent } from './map-controls.component';
import { MapControlsModule } from './map-controls.module';

describe('MapControlsComponent', () => {
  let component: MapControlsComponent ;
  let fixture: ComponentFixture<MapControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MapControlsModule,
        StoreModule.forRoot(appStore.reducers, { metaReducers: appStore.metaReducers }),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
