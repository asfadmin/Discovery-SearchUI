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

import * as models from '@models';
import { ScreenSizeService } from '@services';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { AsyncPipe } from '@angular/common';
import { MatLabel, MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DatasetComponent } from './dataset/dataset.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

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
    MatIcon,
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
    return this.datasets().filter((dataset) => {
      return (
        dataset.name
          .toUpperCase()
          .includes(this.datasetFilter().toUpperCase()) ||
        this.translate
          .instant(dataset.platformDesc)
          .toUpperCase()
          .includes(this.datasetFilter().toUpperCase())
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
