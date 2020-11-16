import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobStatusSelectorComponent } from './job-status-selector.component';

describe('JobStatusSelectorComponent', () => {
  let component: JobStatusSelectorComponent;
  let fixture: ComponentFixture<JobStatusSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobStatusSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobStatusSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
