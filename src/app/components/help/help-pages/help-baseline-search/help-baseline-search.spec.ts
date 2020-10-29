import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpBaselineSearchComponent } from './help-baseline-search.component';

describe('BaselineSearchComponent', () => {
  let component: HelpBaselineSearchComponent;
  let fixture: ComponentFixture<HelpBaselineSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpBaselineSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpBaselineSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
