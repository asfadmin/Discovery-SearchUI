import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersMenuComponent } from './filters-menu.component';

describe('FiltersMenuComponent', () => {
  let component: FiltersMenuComponent;
  let fixture: ComponentFixture<FiltersMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltersMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
