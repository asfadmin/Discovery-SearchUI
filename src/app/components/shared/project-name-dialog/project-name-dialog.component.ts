import {
  Component,
  inject,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  OnInit,
  signal,
  computed,
  ViewEncapsulation,
  HostListener,
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
import {
  MatTableDataSource,
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';

import * as models from '@models';
import { Hyp3ApiService } from '@services';

export interface ProjectEntry {
  name: string;
  count: number;
}

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
  encapsulation: ViewEncapsulation.None,
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
    MatTable,
    MatSortModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslateModule,
    MatRadioModule,
  ],
})
export class ProjectNameDialogComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('projectNameInput') projectNameInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatSort) sort: MatSort;

  private dialogRef =
    inject<MatDialogRef<ProjectNameDialogComponent>>(MatDialogRef);
  private data = inject<ProjectNameDialogData>(MAT_DIALOG_DATA);
  private hyp3Api = inject(Hyp3ApiService);
  private translateService = inject(TranslateService);

  // Use signals for reactive state
  public projectName = signal<string>('');
  public jobCount: number | null = null;
  public projectCount = 0;
  public isDisabledByUserFilter = false;
  public filterUserId: string;
  public confirmationChecked = false;

  // Material table with sorting
  public dataSource = new MatTableDataSource<ProjectEntry>([]);
  public readonly displayedColumns: string[] = ['name', 'count'];

  // Two-phase UI state
  public phase: DialogPhase = 'input';
  public progress = 0;
  public estimatedSecondsRemaining = signal<number | null>(null);
  public successCount = 0;
  public failedCount = 0;
  public failedProjectNames: string[] = [];

  // Computed values (only recalculate when dependencies change)
  public isValid = computed(() => this.projectName().trim().length > 0);

  public formattedTimeRemaining = computed(() => {
    // Only show estimated time for operations of 5+ jobs
    if (this.jobCount < 5 || this.estimatedSecondsRemaining() === null) {
      return null;
    }

    const seconds = this.estimatedSecondsRemaining();
    if (seconds < 60) {
      return `< 1 min`;
    }

    const minutes = Math.ceil(seconds / 60);
    return `~${minutes} min`;
  });

  private subs = new SubSink();

  ngOnInit(): void {
    this.projectName.set(this.data.currentName);

    // Disable input if filtering by a different user's jobs
    const { loggedInUserId, filterUserId } = this.data;
    this.filterUserId = filterUserId;
    if (filterUserId && loggedInUserId && filterUserId !== loggedInUserId) {
      this.isDisabledByUserFilter = true;
    }

    const products = this.data?.products;
    this.jobCount = products?.length;

    if (products) {
      const unnamedLabel = this.translateService.instant(
        'PROJECT_NAME_UNNAMED',
      );
      const counts = new Map<string, number>();
      products.forEach((product) => {
        const name = product.metadata?.job?.name || unnamedLabel;
        counts.set(name, (counts.get(name) || 0) + 1);
      });

      // Convert to array for Material table
      const entries: ProjectEntry[] = Array.from(counts.entries()).map(
        ([name, count]) => ({ name, count }),
      );
      this.dataSource.data = entries;
      this.projectCount = counts.size;
    }

    // Prevent closing during processing
    this.dialogRef.disableClose = false;
  }

  ngAfterViewInit(): void {
    // Connect MatSort to dataSource for automatic sorting
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }

    // Auto-focus the input field after the view is initialized
    setTimeout(() => {
      if (this.projectNameInput && !this.isDisabledByUserFilter) {
        this.projectNameInput.nativeElement.focus();
      }
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onSave(): void {
    if (!this.isValid()) {
      return;
    }

    const trimmedName = this.projectName().trim();

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
    this.subs.add(
      progress$.subscribe(({ percent, estimatedSecondsRemaining }) => {
        this.progress = percent;
        this.estimatedSecondsRemaining.set(estimatedSecondsRemaining);
      }),
    );

    // Subscribe to final result
    this.subs.add(
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
      newName: this.projectName().trim(),
      success: this.successCount,
      failed: this.failedCount,
    };
    this.dialogRef.close(result);
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.phase === 'processing') {
      event.preventDefault();
      // Modern browsers ignore custom messages, but returnValue is still required
      event.returnValue = '';
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
