import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HideIconComponent } from './hide-icon.component';

describe('HideIconComponent', () => {
  let component: HideIconComponent;
  let fixture: ComponentFixture<HideIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HideIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HideIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
