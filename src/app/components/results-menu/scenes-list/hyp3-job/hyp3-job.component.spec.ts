import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Hyp3JobComponent } from './hyp3-job.component';

describe('Hyp3JobComponent', () => {
  let component: Hyp3JobComponent;
  let fixture: ComponentFixture<Hyp3JobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Hyp3JobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Hyp3JobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
