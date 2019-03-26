import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompactSearchSelectorModule } from './compact-search-selector.module';
import { CompactSearchSelectorComponent } from './compact-search-selector.component';

describe('CompactSearchSelectorComponent', () => {
  let component: CompactSearchSelectorComponent;
  let fixture: ComponentFixture<CompactSearchSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CompactSearchSelectorModule ]
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
