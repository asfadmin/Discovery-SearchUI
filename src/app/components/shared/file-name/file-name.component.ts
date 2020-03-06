import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { map } from 'rxjs/operators';

import { ScreenSizeService } from '@services';
import { Breakpoints } from '@models';

@Component({
  selector: 'app-file-name',
  templateUrl: './file-name.component.html',
  styleUrls: ['./file-name.component.scss']
})
export class FileNameComponent implements OnInit, OnDestroy {
  @Input() name: string;
  @Input() dataset: string;
  @Input() isFilename: boolean;

  public sceneNameLen: number;
  private subs = new SubSink();

  constructor(private screenSize: ScreenSizeService) { }

  ngOnInit(): void {
    this.subs.add(
      this.screenSize.size$.pipe(
      map(size => {
        if (size.width > 1900) {
          return 50;
        } else if (size.width > 1750) {
          return 45;
        } else if (size.width > 1500) {
          return 35;
        } else if (size.width > 1350) {
          return 30;
        } else if (size.width > 1200) {
          return 25;
        } else if (size.width > 1000) {
          return 18;
        } else if (size.width > 948 ) {
          return 15;
        } else {
          return 25;
        }
      }),
      ).subscribe(
        len => this.sceneNameLen = len
      )
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
