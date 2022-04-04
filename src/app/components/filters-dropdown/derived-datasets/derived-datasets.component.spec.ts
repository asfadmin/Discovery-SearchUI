import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivedDatasetsComponent } from './derived-datasets.component';

describe('DerivedDatasetsComponent', () => {
  let component: DerivedDatasetsComponent;
  let fixture: ComponentFixture<DerivedDatasetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DerivedDatasetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivedDatasetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
