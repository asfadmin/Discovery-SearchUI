import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-aoi-upload',
  templateUrl: './aoi-upload.component.html',
  styleUrls: ['./aoi-upload.component.css']
})
export class AoiUploadComponent {
  @Input() polygon: string;

  @Output() openFileUpload = new EventEmitter<void>();

  public onFileUpload(): void {
    this.openFileUpload.emit();
  }
}
