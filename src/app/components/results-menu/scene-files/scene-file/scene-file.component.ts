import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

  public isHovered = false;

  public onToggleQueueProduct(): void {
    this.toggle.emit();
  }
}
