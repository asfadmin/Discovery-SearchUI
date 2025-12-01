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

@Component({
  selector: 'app-baseline-scene-controls',
  templateUrl: './baseline-scene-controls.component.html',
  styleUrls: ['./baseline-scene-controls.component.scss'],
  standalone: false,
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
