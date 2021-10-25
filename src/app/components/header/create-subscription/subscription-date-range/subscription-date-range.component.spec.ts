import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionDateRangeComponent } from './subscription-date-range.component';

describe('SubscriptionDateRangeComponent', () => {
  let component: SubscriptionDateRangeComponent;
  let fixture: ComponentFixture<SubscriptionDateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionDateRangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
