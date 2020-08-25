import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbasFiltersComponent } from './sbas-filters.component';

describe('SbasFiltersComponent', () => {
  let component: SbasFiltersComponent;
  let fixture: ComponentFixture<SbasFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbasFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbasFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
