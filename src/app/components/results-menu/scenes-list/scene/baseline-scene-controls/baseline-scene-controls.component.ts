import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';

import * as services from '@services';
import * as models from '@models';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatListItemMeta } from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';
import { OnDemandAddMenuComponent } from '@components/shared/on-demand-add-menu/on-demand-add-menu.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-baseline-scene-controls',
  templateUrl: './baseline-scene-controls.component.html',
  styleUrls: ['./baseline-scene-controls.component.scss'],
  imports: [
    NgClass,

    MatIcon,
    MatMenuTrigger,
    MatListItemMeta,
    MatTooltip,
    OnDemandAddMenuComponent,
    TranslateModule,
  ],
})
export class BaselineSceneControlsComponent implements OnInit {
  private screenSize = inject(services.ScreenSizeService);
  private hyp3JobStatus = inject(services.Hyp3JobStatusService);

  @Input() scene: models.CMRProduct;
  @Input() offsets: { temporal: number; perpendicular: number } = {
    temporal: 0,
    perpendicular: null,
  };
  @Input() hyp3ableByJobType: {
    total: number;
    byJobType: models.Hyp3ableProductByJobType[];
  };
  @Input() isQueued: boolean;

  @Output() onToggleScene = new EventEmitter();

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  ngOnInit(): void {
    this.screenSize.breakpoint$.subscribe(
      (breakpoint) => (this.breakpoint = breakpoint),
    );
  }

  public onToggle(): void {
    this.onToggleScene.emit();
  }

  public withOffset(val: number, offset: number): number {
    return Math.trunc(val + offset);
  }

  public isDownloadable(product: models.CMRProduct): boolean {
    return this.hyp3JobStatus.isDownloadable(product.metadata.job);
  }

  public isExpired(job: models.Hyp3Job): boolean {
    return this.hyp3JobStatus.isExpired(job);
  }
}
