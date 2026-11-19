import { AsyncPipe } from '@angular/common';
import {
  Component,
  inject,
  input,
  computed,
  Signal,
  signal,
  viewChild,
  ElementRef,
  output,
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
  readonly selectedChange = output<string>();

  public datasets = input<models.Dataset[]>();
  public selected = input<string>();

  public datasetFilter = signal<string>(null);
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public isReadMore = true;

  public searchElement = viewChild<ElementRef>('datasetOptions');
  public menuTrigger = viewChild(MatMenuTrigger);

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

  public enterTarget = computed(() => {
    const firstDataset = this.filteredDatasets()?.[0];
    if (
      !this.datasetFilter() ||
      !firstDataset ||
      firstDataset.properties.includes(models.Props.DEPRECATED)
    ) {
      return null;
    }
    return firstDataset;
  });

  public menuOpen() {
    this.searchElement().nativeElement.focus();
  }

  public onFilterEnter(event: Event): void {
    event.preventDefault();
    const dataset = this.enterTarget();
    if (!dataset) {
      return;
    }

    this.onSelectionChange(dataset.id);
    this.menuTrigger().closeMenu();
  }

  public onSelectionChange(dataset: string): void {
    const isDeprecated = this.datasets()
      ?.find((d) => d.id === dataset)
      ?.properties.includes(models.Props.DEPRECATED);
    if (isDeprecated) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'dataset-selected',
      dataset: dataset,
    });
    this.selectedChange.emit(dataset);
  }
}
