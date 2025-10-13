import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@services';
import { ClipboardService } from 'ngx-clipboard';
import { SaveSearchDialogComponent } from '../save-search-dialog';

import Prism from 'prismjs';

export enum CodeExportType {
  ASF_SEARCH,
  HYP3_SDK
}

@Component({
  selector: 'app-code-export',
  templateUrl: './code-export.component.html',
  styleUrls: ['./code-export.component.scss']
})
export class CodeExportComponent implements OnInit, AfterViewInit {
  dialogRef = inject<MatDialogRef<SaveSearchDialogComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);
  clipboard = inject(ClipboardService);
  notificationService = inject(NotificationService);

  public codeStuff: string;

  public codeExportTypes = CodeExportType;
  public codeExportType: CodeExportType;

  @ViewChild('codeblock', { static: false }) divHello: ElementRef;

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
    this.notificationService.info('Copied to clipboard');
  }
}
