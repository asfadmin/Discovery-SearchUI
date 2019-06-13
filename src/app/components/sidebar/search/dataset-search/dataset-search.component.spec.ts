import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/dataset-browser/animations';

import { Store, StoreModule } from '@ngrx/store';
import * as appStore from '@store';

import { DatasetSearchComponent } from './dataset-search.component';
import { DatasetSearchModule } from './dataset-search.module';

describe('DatasetSearchComponent', () => {
  let component: DatasetSearchComponent;
  let fixture: ComponentFixture<DatasetSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        DatasetSearchModule,
        StoreModule.forRoot(appStore.reducers, { metaReducers: appStore.metaReducers }),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
