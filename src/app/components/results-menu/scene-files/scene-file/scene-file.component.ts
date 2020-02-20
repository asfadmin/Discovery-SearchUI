import { Component, Input, Output, EventEmitter } from '@angular/core';

import { UnzipApiService } from '@services';
import * as models from '@models';

@Component({
  selector: 'app-scene-file',
  templateUrl: './scene-file.component.html',
  styleUrls: ['./scene-file.component.css']
})
export class SceneFileComponent {
  @Input() product: models.CMRProduct;
  @Input() isQueued: boolean;

  @Output() toggle = new EventEmitter<void>();
  @Output() unzip = new EventEmitter<models.CMRProduct>();

  constructor(private unzipService: UnzipApiService) {}

  public isHovered = false;

  public onToggleQueueProduct(): void {
    this.toggle.emit();
  }

  public onLoadUnzippedPoduct(): void {
    this.unzip.emit(this.product);
  }
}
