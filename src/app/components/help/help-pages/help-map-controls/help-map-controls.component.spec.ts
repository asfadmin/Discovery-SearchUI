import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpMapControlsComponent } from './help-map-controls.component';

describe('HelpMapControlsComponent', () => {
  let component: HelpMapControlsComponent;
  let fixture: ComponentFixture<HelpMapControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpMapControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpMapControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
