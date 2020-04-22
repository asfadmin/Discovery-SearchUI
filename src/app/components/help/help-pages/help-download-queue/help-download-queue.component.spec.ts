import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDownloadQueueComponent } from './help-download-queue.component';

describe('HelpDownloadQueueComponent', () => {
  let component: HelpDownloadQueueComponent;
  let fixture: ComponentFixture<HelpDownloadQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpDownloadQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpDownloadQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
