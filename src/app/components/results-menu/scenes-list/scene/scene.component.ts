import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import * as services from '@services';
import * as models from '@models';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {
  @Input() scene: models.CMRProduct;
  @Input() searchType: models.SearchType;

  @Input() isSelected: boolean;
  @Input() offsets: {temporal: number, perpendicular: number} = {temporal: 0, perpendicular: null};

  @Input() isQueued: boolean;
  @Input() jobQueued: boolean;
  @Input() numQueued: number;

  @Input() hyp3ableByJobType: { total: number, byJobType: models.Hyp3ableProductByJobType[]};

  @Output() toggleScene = new EventEmitter();

  public hovered: boolean;
  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  public copyIcon = faCopy;
  public SearchTypes = models.SearchType;

  constructor(
    public env: services.EnvironmentService,
    private screenSize: services.ScreenSizeService,
    private mapService: services.MapService,
  ) { }

  ngOnInit(): void {
    this.screenSize.breakpoint$.subscribe(
      breakpoint => this.breakpoint = breakpoint
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
