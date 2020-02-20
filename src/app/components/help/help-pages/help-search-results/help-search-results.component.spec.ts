import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSearchResultsComponent } from './help-search-results.component';

describe('HelpSearchResultsComponent', () => {
  let component: HelpSearchResultsComponent;
  let fixture: ComponentFixture<HelpSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
