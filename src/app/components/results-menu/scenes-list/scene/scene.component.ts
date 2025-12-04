import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import * as services from '@services';
import * as models from '@models';
import { MatListItem } from '@angular/material/list';
import { NgStyle, NgClass } from '@angular/common';
import { FileNameComponent } from '@components/shared/file-name/file-name.component';
import { CopyToClipboardComponent } from '@components/shared/copy-to-clipboard/copy-to-clipboard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltip } from '@angular/material/tooltip';
import { SceneControlsComponent } from './scene-controls/scene-controls.component';
import { BaselineSceneControlsComponent } from './baseline-scene-controls/baseline-scene-controls.component';
import { ShortDatePipe, FullDatePipe } from '@pipes/short-date.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss'],
  imports: [
    MatListItem,
    NgStyle,

    NgClass,
    FileNameComponent,
    CopyToClipboardComponent,
    FontAwesomeModule,
    MatTooltip,
    SceneControlsComponent,
    BaselineSceneControlsComponent,
    ShortDatePipe,
    FullDatePipe,
    TranslateModule,
  ],
})
export class SceneComponent implements OnInit {
  env = inject(services.EnvironmentService);
  private screenSize = inject(services.ScreenSizeService);
  private mapService = inject(services.MapService);

  @Input() scene: models.CMRProduct;
  @Input() searchType: models.SearchType;

  @Input() isSelected: boolean;
  @Input() offsets: { temporal: number; perpendicular: number } = {
    temporal: 0,
    perpendicular: null,
  };

  @Input() isQueued: boolean;
  @Input() jobQueued: boolean;
  @Input() numQueued: number;

  @Input() hyp3ableByJobType: {
    total: number;
    byJobType: models.Hyp3ableProductByJobType[];
  };

  @Output() toggleScene = new EventEmitter();

  public hovered: boolean;
  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  public copyIcon = faCopy;
  public SearchTypes = models.SearchType;

  ngOnInit(): void {
    this.screenSize.breakpoint$.subscribe(
      (breakpoint) => (this.breakpoint = breakpoint),
    );
  }

  public onSetFocused(): void {
    this.hovered = true;
  }

  public onClearFocused(): void {
    this.hovered = false;
  }

  public onZoomTo(): void {
    this.mapService.zoomToScene(this.scene);
  }

  public onToggleScene(): void {
    this.toggleScene.emit();
  }
}
