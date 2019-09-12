import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetNavComponent } from './dataset-nav.component';

describe('DatasetNavComponent', () => {
  let component: DatasetNavComponent;
  let fixture: ComponentFixture<DatasetNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
