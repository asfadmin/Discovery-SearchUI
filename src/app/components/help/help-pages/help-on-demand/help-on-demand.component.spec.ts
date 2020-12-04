import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpOnDemandComponent } from './help-on-demand.component';

describe('HelpOnDemandComponent', () => {
  let component: HelpOnDemandComponent;
  let fixture: ComponentFixture<HelpOnDemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpOnDemandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpOnDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
