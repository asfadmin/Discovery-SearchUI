import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSavedSearchesComponent } from './help-saved-searches.component';

describe('HelpSavedSearchesComponent', () => {
  let component: HelpSavedSearchesComponent;
  let fixture: ComponentFixture<HelpSavedSearchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpSavedSearchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpSavedSearchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
