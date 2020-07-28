import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaselineChartComponent } from './baseline-chart.component';

describe('BaselineChartComponent', () => {
  let component: BaselineChartComponent;
  let fixture: ComponentFixture<BaselineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaselineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaselineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
