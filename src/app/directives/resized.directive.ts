import {
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  inject,
  output,
} from '@angular/core';

export class ResizedEvent {
  public newRect: DOMRectReadOnly;
  public oldRect?: DOMRectReadOnly;
  public isFirst: boolean;

  public constructor(
    newRect: DOMRectReadOnly,
    oldRect: DOMRectReadOnly | undefined,
  ) {
    this.newRect = newRect;
    this.oldRect = oldRect;
    this.isFirst = oldRect == null;
  }
}

@Directive({ selector: '[resized]' })
export class ResizedDirective implements OnInit, OnDestroy {
  private readonly element = inject(ElementRef);
  private readonly zone = inject(NgZone);

  private observer: ResizeObserver;
  private oldRect?: DOMRectReadOnly;

  readonly resized = output<ResizedEvent>();

  public constructor() {
    this.observer = new ResizeObserver((entries) =>
      this.zone.run(() => this.observe(entries)),
    );
  }

  public ngOnInit(): void {
    this.observer.observe(this.element.nativeElement);
  }

  public ngOnDestroy(): void {
    this.observer.disconnect();
  }

  private observe(entries: ResizeObserverEntry[]): void {
    const domSize = entries[0];
    const resizedEvent = new ResizedEvent(domSize.contentRect, this.oldRect);
    this.oldRect = domSize.contentRect;
    this.resized.emit(resizedEvent);
  }
}
