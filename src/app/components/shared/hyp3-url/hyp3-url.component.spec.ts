import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hyp3UrlComponent } from './hyp3-url.component';

describe('Hyp3UrlComponent', () => {
  let component: Hyp3UrlComponent;
  let fixture: ComponentFixture<Hyp3UrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Hyp3UrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Hyp3UrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
