import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseListComponent } from './browse-list.component';

describe('BrowseListComponent', () => {
  let component: BrowseListComponent;
  let fixture: ComponentFixture<BrowseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
