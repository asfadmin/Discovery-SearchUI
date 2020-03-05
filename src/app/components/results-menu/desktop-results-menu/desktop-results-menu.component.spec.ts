import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopResultsMenuComponent } from './desktop-results-menu.component';

describe('DesktopResultsMenuComponent', () => {
  let component: DesktopResultsMenuComponent;
  let fixture: ComponentFixture<DesktopResultsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesktopResultsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopResultsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
