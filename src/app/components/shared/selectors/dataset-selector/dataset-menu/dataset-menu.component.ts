import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardActions } from '@angular/material/card';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { isDatasetActive, Dataset, DateRange } from '@models';
import { DocsModalComponent } from '../../../docs-modal/docs-modal.component';

// Declare GTM dataLayer array.
declare global {
  interface Window {
    dataLayer: any[];
  }
}

export type DatasetFilter = 'all' | 'active' | 'inactive';

interface GroupedDatasets {
  active: Dataset[];
  inactive: Dataset[];
}

@Component({
  selector: 'app-dataset-menu',
  templateUrl: './dataset-menu.component.html',
  styleUrls: ['./dataset-menu.component.scss'],
  imports: [
    NgTemplateOutlet,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardActions,
    TranslateModule,
    DocsModalComponent,
  ],
})
export class DatasetMenuComponent implements OnInit {
  private translate = inject(TranslateService);

  @Input() datasets: Dataset[] = [];
  @Input() selected = '';
  @Input() isMobile = false;
  @Output() datasetSelected = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();

  searchTerm = '';
  activeFilter: DatasetFilter = 'all';

  grouped: GroupedDatasets = { active: [], inactive: [] };
  filteredCount = 0;
  searchedCount = 0;
  totalCount = 0;
  activeTotalCount = 0;
  inactiveTotalCount = 0;

  ngOnInit(): void {
    this.totalCount = this.datasets.length;
    this.updateFilteredDatasets();
  }

  onSearchChange(): void {
    this.updateFilteredDatasets();
  }

  onFilterChange(filter: string): void {
    this.activeFilter = filter as DatasetFilter;
    this.updateFilteredDatasets();
  }

  onSelectDataset(datasetId: string): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'dataset-selected',
      dataset: datasetId,
    });
    this.datasetSelected.emit(datasetId);
  }

  onClose(): void {
    this.closed.emit();
  }

  onDocsAction(event: Event): void {
    event.stopPropagation();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.updateFilteredDatasets();
  }

  prettyDateRange(dateRange: DateRange): string {
    const { start, end } = dateRange;
    const startYear = start.getFullYear();
    const present = this.translate.instant('PRESENT');
    const endYear = !end ? present : end.getFullYear();
    const to = this.translate.instant('DATE_TO');
    return startYear === endYear
      ? `${startYear}`.trim()
      : `${startYear} ${to} ${endYear}`.trim();
  }

  private updateFilteredDatasets(): void {
    const searchLower = this.searchTerm.toLowerCase().trim();

    const searched = searchLower
      ? this.datasets.filter((d) => this.matchesSearch(d, searchLower))
      : [...this.datasets];
    this.searchedCount = searched.length;

    const active: Dataset[] = [];
    const inactive: Dataset[] = [];
    for (const d of searched) {
      (isDatasetActive(d) ? active : inactive).push(d);
    }
    this.activeTotalCount = active.length;
    this.inactiveTotalCount = inactive.length;

    let filteredActive: Dataset[];
    let filteredInactive: Dataset[];
    if (this.activeFilter === 'active') {
      filteredActive = active;
      filteredInactive = [];
    } else if (this.activeFilter === 'inactive') {
      filteredActive = [];
      filteredInactive = inactive;
    } else {
      filteredActive = active;
      filteredInactive = inactive;
    }

    filteredActive.sort((a, b) => a.priority - b.priority);
    filteredInactive.sort((a, b) => a.priority - b.priority);

    this.grouped = { active: filteredActive, inactive: filteredInactive };
    this.filteredCount = filteredActive.length + filteredInactive.length;
  }

  private matchesSearch(dataset: Dataset, searchLower: string): boolean {
    if (dataset.name.toLowerCase().includes(searchLower)) {
      return true;
    }

    const desc = this.translate.instant(dataset.platformDesc);
    if (typeof desc === 'string' && desc.toLowerCase().includes(searchLower)) {
      return true;
    }

    if (dataset.source?.name.toLowerCase().includes(searchLower)) {
      return true;
    }

    return false;
  }
}
