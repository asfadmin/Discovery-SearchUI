import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSelectorComponent } from './search-selector.component';

describe('SearchSelectorComponent', () => {
  let component: SearchSelectorComponent;
  let fixture: ComponentFixture<SearchSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSelectorComponent ]
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
