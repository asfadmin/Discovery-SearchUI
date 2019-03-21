import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedSearchSelectorComponent } from './detailed-search-selector.component';
import { DetailedSearchSelectorModule } from './detailed-search-selector.module';

describe('DetailedSearchSelectorComponent', () => {
  let component: DetailedSearchSelectorComponent;
  let fixture: ComponentFixture<DetailedSearchSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ DetailedSearchSelectorModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedSearchSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
