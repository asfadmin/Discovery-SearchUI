import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpGeoSearchComponent } from './help-geo-search.component';

describe('HelpGeoSearchComponent', () => {
  let component: HelpGeoSearchComponent;
  let fixture: ComponentFixture<HelpGeoSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpGeoSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpGeoSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
