import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbasResultsMenuComponent } from './sbas-results-menu.component';

describe('SbasResultsMenuComponent', () => {
  let component: SbasResultsMenuComponent;
  let fixture: ComponentFixture<SbasResultsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbasResultsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbasResultsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
