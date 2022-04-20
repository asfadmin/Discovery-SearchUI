import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsModalComponent } from './docs-modal.component';

describe('DocsModalComponent', () => {
  let component: DocsModalComponent;
  let fixture: ComponentFixture<DocsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
