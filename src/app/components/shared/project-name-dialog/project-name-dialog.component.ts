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
import { MatChipsModule } from '@angular/material/chips';

export interface ProjectNameDialogData {
  currentName: string;
  products?: models.CMRProduct[];
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
    MatChipsModule,
  ],
})
export class ProjectNameDialogComponent {
  dialogRef = inject<MatDialogRef<ProjectNameDialogComponent>>(MatDialogRef);
  data = inject<ProjectNameDialogData>(MAT_DIALOG_DATA);

  public projectName: string;
  public jobCount = null;
  public uniqueProjectNames: Set<string> | null = null;

  constructor() {
    this.projectName = this.data.currentName;

    const products = this.data?.products;
    this.jobCount = products?.length;

    if (products) {
      this.uniqueProjectNames = new Set(
        products
          .map((product) => product.metadata?.job.name)
          .filter((projectName) => !!projectName),
      );
    }
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
