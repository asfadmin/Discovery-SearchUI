import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSelectorComponent } from './view-selector.component';

describe('ProjectionSelectionComponent', () => {
  let component: ViewSelectorComponent;
  let fixture: ComponentFixture<ViewSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
