import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionJobOptionsComponent } from './subscription-job-options.component';

describe('SubscriptionJobOptionsComponent', () => {
  let component: SubscriptionJobOptionsComponent;
  let fixture: ComponentFixture<SubscriptionJobOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionJobOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionJobOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
