import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectionSelectionComponent } from './projection-selection.component';

describe('ProjectionSelectionComponent', () => {
  let component: ProjectionSelectionComponent;
  let fixture: ComponentFixture<ProjectionSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectionSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectionSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
