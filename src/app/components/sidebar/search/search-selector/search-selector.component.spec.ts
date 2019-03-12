import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSelectorComponent } from './search-selector.component';
import { SearchSelectorModule } from './search-selector.module';

describe('SearchSelectorComponent', () => {
  let component: SearchSelectorComponent;
  let fixture: ComponentFixture<SearchSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SearchSelectorModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
