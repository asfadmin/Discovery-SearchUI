import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  inject,
  OnDestroy,
} from '@angular/core';

import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { firstValueFrom } from 'rxjs';
import { SubSink } from 'subsink';

import * as models from '@models';
import { ScreenSizeService } from '@services';
import { AsyncPipe } from '@angular/common';
import { MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { DatasetMenuComponent } from './dataset-menu/dataset-menu.component';

@Component({
  selector: 'app-dataset-selector',
  templateUrl: './dataset-selector.component.html',
  styleUrls: ['./dataset-selector.component.scss'],
  imports: [MatLabel, MatButton, AsyncPipe, TranslateModule],
})
export class DatasetSelectorComponent implements OnDestroy {
  private overlay = inject(Overlay);
  private screenSize = inject(ScreenSizeService);

  @Input() datasets: models.Dataset[];
  @Input() selected: string;
  @Output() selectedChange = new EventEmitter<string>();
  @ViewChild('triggerButton', { read: ElementRef }) triggerButton: ElementRef;

  breakpoint$ = this.screenSize.breakpoint$;
  breakpoints = models.Breakpoints;

  private overlayRef: OverlayRef | null = null;
  private subs = new SubSink();
  private isOpening = false;

  get isMenuOpen(): boolean {
    return this.overlayRef?.hasAttached() ?? false;
  }

  toggleMenu(): void {
    if (this.isOpening) {
      return;
    }
    if (this.overlayRef?.hasAttached()) {
      this.closeMenu();
      return;
    }
    void this.openMenu();
  }

  datasetNameLookup(datasetId: string): string {
    return this.datasets.find((d) => d.id === datasetId)?.name ?? '';
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.closeMenu();
  }

  private async openMenu(): Promise<void> {
    this.isOpening = true;
    const breakpoint = await firstValueFrom(this.screenSize.breakpoint$);
    const isMobile = breakpoint === models.Breakpoints.MOBILE;

    const triggerRect =
      this.triggerButton.nativeElement.getBoundingClientRect();

    const config = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: isMobile
        ? 'cdk-overlay-dark-backdrop'
        : 'cdk-overlay-transparent-backdrop',
      width: isMobile ? '100vw' : '600px',
      height: '100vh',
      positionStrategy: isMobile
        ? this.overlay.position().global().top('0').left('0')
        : this.overlay
            .position()
            .global()
            .top('0')
            .left(`${triggerRect.left}px`),
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });

    this.overlayRef = this.overlay.create(config);
    this.isOpening = false;

    const portal = new ComponentPortal(DatasetMenuComponent);
    const componentRef = this.overlayRef.attach(portal);

    componentRef.instance.datasets = this.datasets;
    componentRef.instance.selected = this.selected;
    componentRef.instance.isMobile = isMobile;

    this.subs.add(
      componentRef.instance.datasetSelected.subscribe((datasetId: string) => {
        this.selectedChange.emit(datasetId);
        this.closeMenu();
      }),
    );

    this.subs.add(
      componentRef.instance.closed.subscribe(() => {
        this.closeMenu();
      }),
    );

    this.subs.add(
      this.overlayRef.backdropClick().subscribe(() => {
        this.closeMenu();
      }),
    );

    this.subs.add(
      this.overlayRef.keydownEvents().subscribe((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          this.closeMenu();
        }
      }),
    );

    // Focus search input after overlay renders
    setTimeout(() => {
      const input =
        this.overlayRef?.overlayElement?.querySelector<HTMLInputElement>(
          'input[matInput]',
        );
      input?.focus();
    });
  }

  private closeMenu(): void {
    this.isOpening = false;
    this.subs.unsubscribe();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.triggerButton?.nativeElement?.focus();
  }
}
