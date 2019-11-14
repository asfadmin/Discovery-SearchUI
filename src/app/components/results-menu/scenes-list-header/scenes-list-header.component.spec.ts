import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenesListHeaderComponent } from './scenes-list-header.component';

describe('ScenesListHeaderComponent', () => {
  let component: ScenesListHeaderComponent;
  let fixture: ComponentFixture<ScenesListHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenesListHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenesListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
