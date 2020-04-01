import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileResultsMenuComponent } from './mobile-results-menu.component';

describe('MobileResultsMenuComponent', () => {
  let component: MobileResultsMenuComponent;
  let fixture: ComponentFixture<MobileResultsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileResultsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileResultsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
