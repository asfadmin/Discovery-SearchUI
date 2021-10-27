import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionFiltersComponent } from './subscription-filters.component';

describe('SubscriptionFiltersComponent', () => {
  let component: SubscriptionFiltersComponent;
  let fixture: ComponentFixture<SubscriptionFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
