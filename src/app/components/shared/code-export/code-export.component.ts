import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@services';
import { ClipboardService } from 'ngx-clipboard';
import { SaveSearchDialogComponent } from '../save-search-dialog';

import Prism from 'prismjs';

@Component({
  selector: 'app-code-export',
  templateUrl: './code-export.component.html',
  styleUrls: ['./code-export.component.scss']
})
export class CodeExportComponent implements OnInit {
  public codeStuff;
  @ViewChild('codeblock', { static: false }) divHello: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<SaveSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public clipboard: ClipboardService,
    public notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.codeStuff = this.data.codeStuff;
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
