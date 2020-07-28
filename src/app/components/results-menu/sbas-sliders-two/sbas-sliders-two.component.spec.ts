import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbasSlidersTwoComponent } from './sbas-sliders-two.component';

describe('SbasSlidersTwoComponent', () => {
  let component: SbasSlidersTwoComponent;
  let fixture: ComponentFixture<SbasSlidersTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbasSlidersTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbasSlidersTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
