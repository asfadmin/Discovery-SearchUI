import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaselineSearchFiltersComponent } from './baseline-search-filters.component';

describe('BaselineSearchFiltersComponent', () => {
  let component: BaselineSearchFiltersComponent;
  let fixture: ComponentFixture<BaselineSearchFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaselineSearchFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaselineSearchFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
