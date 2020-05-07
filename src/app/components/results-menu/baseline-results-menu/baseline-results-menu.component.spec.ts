import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaselineResultsMenuComponent } from './baseline-results-menu.component';

describe('BaselineResultsMenuComponent', () => {
  let component: BaselineResultsMenuComponent;
  let fixture: ComponentFixture<BaselineResultsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaselineResultsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaselineResultsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
