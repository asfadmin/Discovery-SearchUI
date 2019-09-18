import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNavComponent } from './list-nav.component';

describe('ListNavComponent', () => {
  let component: ListNavComponent;
  let fixture: ComponentFixture<ListNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
