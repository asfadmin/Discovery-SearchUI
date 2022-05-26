import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsetOptionComponent } from './subset-option.component';

describe('SubsetOptionComponent', () => {
  let component: SubsetOptionComponent;
  let fixture: ComponentFixture<SubsetOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubsetOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsetOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
