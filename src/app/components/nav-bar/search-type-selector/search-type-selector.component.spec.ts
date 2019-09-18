import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTypeSelectorComponent } from './search-type-selector.component';

describe('SearchTypeSelectorComponent', () => {
  let component: SearchTypeSelectorComponent;
  let fixture: ComponentFixture<SearchTypeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchTypeSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
