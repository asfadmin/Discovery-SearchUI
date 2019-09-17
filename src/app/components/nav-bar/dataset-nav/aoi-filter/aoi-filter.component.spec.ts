import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AoiFilterComponent } from './aoi-filter.component';

describe('AoiFilterComponent', () => {
  let component: AoiFilterComponent;
  let fixture: ComponentFixture<AoiFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AoiFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AoiFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
