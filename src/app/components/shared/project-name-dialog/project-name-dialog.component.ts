import {
  Component,
  inject,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import * as models from '@models';
import { Hyp3ApiService } from '@services';

type SortColumn = 'name' | 'count';
type SortDirection = 'asc' | 'desc';

export type DialogPhase = 'input' | 'processing' | 'complete' | 'error';

export interface ProjectNameDialogData {
  currentName: string;
  products?: models.CMRProduct[];
  loggedInUserId?: string;
  filterUserId?: string;
}

export interface ProjectNameDialogResult {
  newName: string;
  success: number;
  failed: number;
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
    MatProgressBarModule,
    MatCheckboxModule,
    TranslateModule,
  ],
})
export class ProjectNameDialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('projectNameInput') projectNameInput: ElementRef<HTMLInputElement>;

  dialogRef = inject<MatDialogRef<ProjectNameDialogComponent>>(MatDialogRef);
  data = inject<ProjectNameDialogData>(MAT_DIALOG_DATA);
  private hyp3Api = inject(Hyp3ApiService);

  public projectName: string;
  public jobCount = null;
  public projectCount = 0;
  public projectNameCounts: Map<string, number> | null = null;
  public sortedEntries: { key: string; value: number }[] = [];
  public sortColumn: SortColumn = 'name';
  public sortDirection: SortDirection = 'asc';
  public isDisabledByUserFilter = false;
  public filterUserId: string;
  public confirmationChecked = false;

  // Two-phase UI state
  public phase: DialogPhase = 'input';
  public progress = 0;
  public estimatedSecondsRemaining: number | null = null;
  public successCount = 0;
  public failedCount = 0;
  public failedProjectNames: string[] = [];

  private subscriptions: Subscription[] = [];

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
      this.projectCount = counts.size;
      this.updateSortedEntries();
    }

    // Prevent closing during processing
    this.dialogRef.disableClose = false;
  }

  ngAfterViewInit(): void {
    // Auto-focus the input field after the view is initialized
    setTimeout(() => {
      if (this.projectNameInput && !this.isDisabledByUserFilter) {
        this.projectNameInput.nativeElement.focus();
      }
    });
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

  /**
   * Returns the estimated time remaining formatted as a human-readable string.
   * Only shows for large operations (1000+ jobs).
   */
  public get formattedTimeRemaining(): string | null {
    // Only show estimated time for large operations
    if (this.jobCount < 1000 || this.estimatedSecondsRemaining === null) {
      return null;
    }

    const seconds = this.estimatedSecondsRemaining;
    if (seconds < 60) {
      return `< 1 min`;
    }

    const minutes = Math.ceil(seconds / 60);
    if (minutes === 1) {
      return `~1 min`;
    }

    return `~${minutes} min`;
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onSave(): void {
    if (!this.isValid) {
      return;
    }

    const trimmedName = this.projectName.trim();

    // If no products, just return the name (single-file rename flow)
    if (!this.data.products || this.data.products.length === 0) {
      this.dialogRef.close(trimmedName);
      return;
    }

    // Transition to processing phase for bulk rename
    this.phase = 'processing';
    this.dialogRef.disableClose = true;
    this.progress = 0;

    const { progress$, result$ } = this.hyp3Api.updateJobsNameWithProgress$(
      this.data.products,
      trimmedName,
    );

    // Subscribe to progress updates
    this.subscriptions.push(
      progress$.subscribe(({ percent, estimatedSecondsRemaining }) => {
        this.progress = percent;
        this.estimatedSecondsRemaining = estimatedSecondsRemaining;
      }),
    );

    // Subscribe to final result
    this.subscriptions.push(
      result$.subscribe({
        next: ({ success, failed, failedProjectNames }) => {
          this.successCount = success;
          this.failedCount = failed;
          this.failedProjectNames = failedProjectNames;
          this.phase = 'complete';
          this.dialogRef.disableClose = false;
        },
        error: () => {
          this.phase = 'error';
          this.dialogRef.disableClose = false;
        },
      }),
    );
  }

  public onDone(): void {
    const result: ProjectNameDialogResult = {
      newName: this.projectName.trim(),
      success: this.successCount,
      failed: this.failedCount,
    };
    this.dialogRef.close(result);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
