import { async, ComponentFixture, fakeAsync, TestBed, inject, tick } from '@angular/core/testing';

import { ResultsComponent } from './results.component';
import { ResultsModule } from './results.module';

import { Store } from '@ngrx/store';
import { GranulesState } from '@store/granules';
import { TestStore } from '@testing/services';
import { granuleState } from '@testing/data';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let store: TestStore<{granules: GranulesState}>;
  let dispatchSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ResultsModule ],
      providers: [
        { provide: Store, useClass: TestStore }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
  });

  beforeEach(inject([Store], (testStore: TestStore<{ granules: GranulesState }>) => {
    store = testStore;
    dispatchSpy = spyOn(store, 'dispatch');
    store.setState(granuleState);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
