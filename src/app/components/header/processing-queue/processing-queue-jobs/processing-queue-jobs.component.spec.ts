import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingQueueJobsComponent } from './processing-queue-jobs.component';

describe('ProcessingQueueJobsComponent', () => {
  let component: ProcessingQueueJobsComponent;
  let fixture: ComponentFixture<ProcessingQueueJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessingQueueJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingQueueJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
