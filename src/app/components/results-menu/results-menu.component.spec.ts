import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsMenuComponent } from './results-menu.component';

describe('ResultsMenuComponent', () => {
  let component: ResultsMenuComponent;
  let fixture: ComponentFixture<ResultsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
