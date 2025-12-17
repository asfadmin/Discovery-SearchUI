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

export interface ProjectNameDialogData {
  currentName: string;
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

  constructor() {
    this.projectName = this.data.currentName;
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onSave(): void {
    this.dialogRef.close(this.projectName);
  }
}
