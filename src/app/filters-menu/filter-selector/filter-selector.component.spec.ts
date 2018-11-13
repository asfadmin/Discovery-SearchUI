import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSelectorComponent } from './filter-selector.component';

describe('FilterSelectorComponent', () => {
  let component: FilterSelectorComponent;
  let fixture: ComponentFixture<FilterSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
