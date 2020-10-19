import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueSubmitComponent } from './queue-submit.component';

describe('QueueSubmitComponent', () => {
  let component: QueueSubmitComponent;
  let fixture: ComponentFixture<QueueSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
