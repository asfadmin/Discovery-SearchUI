import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSbasSearchComponent } from './help-sbas-search.component';

describe('SbasSearchComponent', () => {
  let component: HelpSbasSearchComponent;
  let fixture: ComponentFixture<HelpSbasSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpSbasSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpSbasSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
