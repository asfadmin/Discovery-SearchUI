import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompactSearchSelectorComponent } from './compact-search-selector.component';

describe('CompactSearchSelectorComponent', () => {
  let component: CompactSearchSelectorComponent;
  let fixture: ComponentFixture<CompactSearchSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompactSearchSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompactSearchSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
