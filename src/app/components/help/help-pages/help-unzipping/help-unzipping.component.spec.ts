import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpUnzippingComponent } from './help-unzipping.component';

describe('HelpUnzippingComponent', () => {
  let component: HelpUnzippingComponent;
  let fixture: ComponentFixture<HelpUnzippingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpUnzippingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpUnzippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
