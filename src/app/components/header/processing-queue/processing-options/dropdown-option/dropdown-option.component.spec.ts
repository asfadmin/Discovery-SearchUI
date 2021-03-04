import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownOptionComponent } from './dropdown-option.component';

describe('DropdownOptionComponent', () => {
  let component: DropdownOptionComponent;
  let fixture: ComponentFixture<DropdownOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
