import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Platform } from '@models';

@Component({
  selector: 'app-path-selector',
  templateUrl: './path-selector.component.html',
  styleUrls: ['./path-selector.component.scss']
})
export class PathSelectorComponent {
  @Input() selected: Platform[];

  @Output() newPathStart = new EventEmitter<number>();
  @Output() newPathEnd = new EventEmitter<number>();
  @Output() newFrameStart = new EventEmitter<number>();
  @Output() newFrameEnd = new EventEmitter<number>();

  public onPathStartChanged(path: string): void {
    this.newPathStart.emit(+path);
  }

  public onPathEndChanged(path: string): void {
    this.newPathEnd.emit(+path);
  }

  public onFrameStartChanged(frame: string): void {
    this.newFrameStart.emit(+frame);
  }

  public onFrameEndChanged(frame: string): void {
    this.newFrameEnd.emit(+frame);
  }
}
