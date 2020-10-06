import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingOptionsComponent } from './processing-options.component';

describe('ProcessingOptionsComponent', () => {
  let component: ProcessingOptionsComponent;
  let fixture: ComponentFixture<ProcessingOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessingOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
