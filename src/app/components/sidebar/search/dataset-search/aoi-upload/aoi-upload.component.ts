import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-aoi-upload',
  templateUrl: './aoi-upload.component.html',
  styleUrls: ['./aoi-upload.component.css']
})
export class AoiUploadComponent {
  @Input() polygon: string;

  @Output() openFileUpload = new EventEmitter<void>();

  constructor(
    private clipboard: ClipboardService
  ) {}

  public onFileUpload(): void {
    this.openFileUpload.emit();
  }

  public onCopy(): void {
    this.clipboard.copyFromContent(this.polygon);
  }
}
