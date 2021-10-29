import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnDemandSubscriptionComponent } from './on-demand-subscription.component';

describe('OnDemandSubscriptionComponent', () => {
  let component: OnDemandSubscriptionComponent;
  let fixture: ComponentFixture<OnDemandSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnDemandSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnDemandSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
