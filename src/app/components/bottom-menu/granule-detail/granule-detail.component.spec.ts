import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GranuleDetailComponent } from './granule-detail.component';

describe('GranuleDetailComponent', () => {
  let component: GranuleDetailComponent;
  let fixture: ComponentFixture<GranuleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GranuleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GranuleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
