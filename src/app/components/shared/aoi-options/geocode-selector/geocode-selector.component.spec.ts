import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeocodeSelectorComponent } from './geocode-selector.component';

describe('GeocodeSelectorComponent', () => {
  let component: GeocodeSelectorComponent;
  let fixture: ComponentFixture<GeocodeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeocodeSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeocodeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
