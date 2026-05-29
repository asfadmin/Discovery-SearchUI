import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  inject,
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { AsfLanguageService, NotificationService } from '@services';
import { ClipboardService } from 'ngx-clipboard';
import { SaveSearchDialogComponent } from '../save-search-dialog';

import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DocsModalComponent } from '../docs-modal/docs-modal.component';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

export enum CodeExportType {
  ASF_SEARCH,
  HYP3_SDK,
}

@Component({
  selector: 'app-code-export',
  templateUrl: './code-export.component.html',
  styleUrls: ['./code-export.component.scss'],
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    DocsModalComponent,
    MatButton,
    MatDialogClose,
    TranslateModule,
  ],
})
export class CodeExportComponent implements OnInit, AfterViewInit {
  dialogRef = inject<MatDialogRef<SaveSearchDialogComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);
  clipboard = inject(ClipboardService);
  notificationService = inject(NotificationService);
  private language = inject(AsfLanguageService);

  public codeStuff = '';

  public codeExportTypes = CodeExportType;
  public codeExportType: CodeExportType = CodeExportType.ASF_SEARCH;

  @ViewChild('codeblock', { static: false }) divHello!: ElementRef;

  ngOnInit(): void {
    this.codeStuff = this.data.codeStuff;
    this.codeExportType = this.data.codeExportType;
  }
  ngAfterViewInit(): void {
    const grammar = Prism.languages['python'];
    const html = Prism.highlight(this.codeStuff, grammar, 'python');
    this.divHello.nativeElement.innerHTML = html;
  }
  public onCloseCodeExport(): void {
    this.dialogRef.close();
  }
  public copyToClipboard(): void {
    this.clipboard.copy(this.codeStuff);
    this.notificationService.info(
      this.language.translate.instant('COPIED_TO_CLIPBOARD'),
    );
  }
}
