import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbasSlidersComponent } from './sbas-sliders.component';

describe('SbasSlidersComponent', () => {
  let component: SbasSlidersComponent;
  let fixture: ComponentFixture<SbasSlidersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbasSlidersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbasSlidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
