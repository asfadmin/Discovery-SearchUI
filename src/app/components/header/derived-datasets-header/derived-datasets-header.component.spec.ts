import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivedDatasetsHeaderComponent } from './derived-datasets-header.component';

describe('DerivedDatasetsHeaderComponent', () => {
  let component: DerivedDatasetsHeaderComponent;
  let fixture: ComponentFixture<DerivedDatasetsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DerivedDatasetsHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivedDatasetsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
