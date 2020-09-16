import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import * as services from '@services';
import * as models from '@models';

@Component({
  selector: 'app-hyp3-job',
  templateUrl: './hyp3-job.component.html',
  styleUrls: ['./hyp3-job.component.scss']
})
export class Hyp3JobComponent implements OnInit {
  @Input() scene: models.CMRProduct;
  @Input() job: models.Hyp3Job;
  @Input() searchType: models.SearchType;

  @Input() isHovered: boolean;
  @Input() isSelected: boolean;

  @Input() isQueued: boolean;
  @Input() numQueued: number;

  @Output() zoomTo = new EventEmitter();
  @Output() toggleScene = new EventEmitter();

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  public copyIcon = faCopy;
  public SearchTypes = models.SearchType;

  constructor(
    private screenSize: services.ScreenSizeService,
  ) { }

  ngOnInit(): void {
    this.screenSize.breakpoint$.subscribe(
      breakpoint => this.breakpoint = breakpoint
    );
  }

  public withOffset(val: number, offset: number): number {
    return Math.trunc(val + offset);
  }

  public onZoomTo(): void {
    this.zoomTo.emit();
  }

  public onToggleScene(): void {
    this.toggleScene.emit();
  }
}
