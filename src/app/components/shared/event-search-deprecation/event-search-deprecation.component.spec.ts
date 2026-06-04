import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { EventSearchDeprecationComponent } from './event-search-deprecation.component';
import { beforeEach, describe, expect, it } from 'vitest';
import testProviders from '@testing/providers';

describe('EventSearchDeprecationComponent', () => {
  let fixture: ComponentFixture<EventSearchDeprecationComponent>;
  let component: EventSearchDeprecationComponent;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventSearchDeprecationComponent],
      providers: [...testProviders, { provide: MatDialogRef, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(EventSearchDeprecationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display deprecation title', () => {
    const title = compiled.querySelector('#deprecation-dialog-title');
    expect(title?.textContent).toContain('Event Search Deprecation');
  });

  it('should link to HyP3 docs', () => {
    const link = compiled.querySelector<HTMLAnchorElement>('a[href]');
    expect(link?.href).toBe('https://hyp3-docs.asf.alaska.edu/');
  });

  it('should have a close button', () => {
    expect(compiled.querySelector('button')).toBeTruthy();
  });
});
