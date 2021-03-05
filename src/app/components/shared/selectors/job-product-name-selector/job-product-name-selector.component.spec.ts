import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobProductNameSelectorComponent } from './job-product-name-selector.component';

describe('JobProductNameSelectorComponent', () => {
  let component: JobProductNameSelectorComponent;
  let fixture: ComponentFixture<JobProductNameSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobProductNameSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobProductNameSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
