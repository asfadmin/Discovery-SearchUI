import { AsyncPipe } from '@angular/common';
import {
  Component,
  Output,
  EventEmitter,
  inject,
  input,
  computed,
  Signal,
  signal,
  viewChild,
  ElementRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLabel, MatInputModule } from '@angular/material/input';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import * as models from '@models';
import { ScreenSizeService } from '@services';

import { DatasetComponent } from './dataset/dataset.component';

// Declare GTM dataLayer array.
declare global {
  interface Window {
    dataLayer: any[];
  }
}

@Component({
  selector: 'app-dataset-selector',
  templateUrl: './dataset-selector.component.html',
  styleUrls: ['./dataset-selector.component.scss'],
  imports: [
    MatLabel,
    MatButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    AsyncPipe,
    TranslateModule,
    DatasetComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatIconButton,
  ],
})
export class DatasetSelectorComponent {
  private screenSize = inject(ScreenSizeService);
  private translate = inject(TranslateService);
  @Output() selectedChange = new EventEmitter<string>();

  public datasets = input<models.Dataset[]>();
  public selected = input<string>();

  public datasetFilter = signal<string>(null);
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public isReadMore = true;

  public searchElement = viewChild<ElementRef>('datasetOptions');

  public datasetName = computed(() => {
    let datasetName = '';
    this.datasets().forEach((dataset) => {
      if (dataset.id === this.selected()) {
        datasetName = dataset.name;
      }
    });
    return datasetName;
  });

  public filteredDatasets: Signal<models.Dataset[]> = computed(() => {
    if (!this.datasetFilter()) {
      return this.datasets();
    }
    const userInput = this.datasetFilter().toUpperCase();
    return this.datasets().filter((dataset) => {
      return (
        dataset.name.toUpperCase().includes(userInput) ||
        this.translate
          .instant(dataset.description)
          .toUpperCase()
          .includes(userInput) ||
        dataset.source.name.includes(userInput)
      );
    });
  });

  public menuOpen() {
    this.searchElement().nativeElement.focus();
  }

  public onSelectionChange(dataset: string): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'dataset-selected',
      dataset: dataset,
    });
    this.selectedChange.emit(dataset);
  }
}
