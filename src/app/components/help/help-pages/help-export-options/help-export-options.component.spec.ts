import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpExportOptionsComponent } from './help-export-options.component';

describe('HelpExportOptionsComponent', () => {
  let component: HelpExportOptionsComponent;
  let fixture: ComponentFixture<HelpExportOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpExportOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpExportOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
