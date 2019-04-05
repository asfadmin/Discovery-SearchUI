import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { ClipboardService } from 'ngx-clipboard';

import { MapDrawModeType } from '@models';

@Component({
  selector: 'app-aoi-upload',
  templateUrl: './aoi-upload.component.html',
  styleUrls: ['./aoi-upload.component.css']
})
export class AoiUploadComponent {
  @Input() polygon: string;
  @Input() drawMode: MapDrawModeType;

  @Output() openFileUpload = new EventEmitter<void>();
  @Output() newDrawMode = new EventEmitter<MapDrawModeType>();

  constructor(
    private clipboard: ClipboardService
  ) {}

  public onFileUpload(): void {
    this.openFileUpload.emit();
  }

  public onNewDrawMode(mode: MapDrawModeType): void {
    this.newDrawMode.emit(mode);
  }

  public onCopy(): void {
    this.clipboard.copyFromContent(this.polygon);
  }
}
