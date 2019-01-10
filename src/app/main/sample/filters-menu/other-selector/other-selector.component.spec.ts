import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherSelectorComponent } from './other-selector.component';

describe('OtherSelectorComponent', () => {
  let component: OtherSelectorComponent;
  let fixture: ComponentFixture<OtherSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
