import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/dataset-browser/animations';

import { DetailedSearchSelectorComponent } from './detailed-search-selector.component';
import { DetailedSearchSelectorModule } from './detailed-search-selector.module';

xdescribe('DetailedSearchSelectorComponent', () => {
  let component: DetailedSearchSelectorComponent;
  let fixture: ComponentFixture<DetailedSearchSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        DetailedSearchSelectorModule,
      ]
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
