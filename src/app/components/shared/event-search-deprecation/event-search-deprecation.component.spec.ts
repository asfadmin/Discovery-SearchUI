import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { EventSearchDeprecationComponent } from './event-search-deprecation.component';

describe('EventSearchDeprecationComponent', () => {
  let fixture: ComponentFixture<EventSearchDeprecationComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventSearchDeprecationComponent, TranslateModule.forRoot()],
      providers: [{ provide: MatDialogRef, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(EventSearchDeprecationComponent);
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeDefined();
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
