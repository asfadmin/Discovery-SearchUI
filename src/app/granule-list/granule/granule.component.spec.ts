import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GranuleComponent } from './granule.component';

describe('GranuleComponent', () => {
  let component: GranuleComponent;
  let fixture: ComponentFixture<GranuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GranuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GranuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
