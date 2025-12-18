import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

import * as models from '@models';

type SortColumn = 'name' | 'count';
type SortDirection = 'asc' | 'desc';

export interface ProjectNameDialogData {
  currentName: string;
  products?: models.CMRProduct[];
  loggedInUserId?: string;
  filterUserId?: string;
}

@Component({
  selector: 'app-project-name-dialog',
  templateUrl: './project-name-dialog.component.html',
  styleUrls: ['./project-name-dialog.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
  ],
})
export class ProjectNameDialogComponent {
  dialogRef = inject<MatDialogRef<ProjectNameDialogComponent>>(MatDialogRef);
  data = inject<ProjectNameDialogData>(MAT_DIALOG_DATA);

  public projectName: string;
  public jobCount = null;
  public projectNameCounts: Map<string, number> | null = null;
  public sortedEntries: Array<{ key: string; value: number }> = [];
  public sortColumn: SortColumn = 'name';
  public sortDirection: SortDirection = 'asc';
  public isDisabledByUserFilter = false;
  public filterUserId: string;

  constructor() {
    this.projectName = this.data.currentName;

    // Disable input if filtering by a different user's jobs
    const { loggedInUserId, filterUserId } = this.data;
    this.filterUserId = filterUserId;
    if (filterUserId && loggedInUserId && filterUserId !== loggedInUserId) {
      this.isDisabledByUserFilter = true;
    }

    const products = this.data?.products;
    this.jobCount = products?.length;

    if (products) {
      const counts = new Map<string, number>();
      products.forEach((product) => {
        const name = product.metadata?.job?.name;
        if (name) {
          counts.set(name, (counts.get(name) || 0) + 1);
        }
      });
      this.projectNameCounts = counts.size > 0 ? counts : null;
      this.updateSortedEntries();
    }
  }

  public sortBy(column: SortColumn): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.updateSortedEntries();
  }

  private updateSortedEntries(): void {
    if (!this.projectNameCounts) {
      this.sortedEntries = [];
      return;
    }

    this.sortedEntries = Array.from(this.projectNameCounts.entries())
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => {
        let comparison: number;
        if (this.sortColumn === 'name') {
          comparison = a.key.localeCompare(b.key);
        } else {
          comparison = a.value - b.value;
        }
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
  }

  public get isValid(): boolean {
    return this.projectName?.trim().length > 0;
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onSave(): void {
    if (this.isValid) {
      this.dialogRef.close(this.projectName.trim());
    }
  }
}
