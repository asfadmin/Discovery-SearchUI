import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpFiltersComponent } from './help-filters.component';

describe('HelpFiltersComponent', () => {
  let component: HelpFiltersComponent;
  let fixture: ComponentFixture<HelpFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
