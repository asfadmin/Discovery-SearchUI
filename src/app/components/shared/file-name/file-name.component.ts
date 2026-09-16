import { Component, OnInit, Input, OnDestroy, inject } from '@angular/core';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { map } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { SearchType } from '@models';
import { ScreenSizeService } from '@services';

@Component({
  selector: 'app-file-name',
  templateUrl: './file-name.component.html',
  styleUrls: ['./file-name.component.scss'],
  imports: [TruncateModule],
})
export class FileNameComponent implements OnInit, OnDestroy {
  private screenSize = inject(ScreenSizeService);

  @Input() name: string;
  @Input() dataset: string;
  @Input() searchType: SearchType;
  @Input() len: number;

  public SearchTypes = SearchType;
  public sceneNameLen: number;
  private subs = new SubSink();

  ngOnInit(): void {
    this.subs.add(
      this.screenSize.size$
        .pipe(
          map((size) => {
            if (this.len) {
              return this.len;
            }

            if (size.width > 1900) {
              return 35;
            } else if (size.width > 1750) {
              return 30;
            } else if (size.width > 1515) {
              return 25;
            } else if (size.width > 1350) {
              return 18;
            } else if (size.width > 1240) {
              return 16;
            } else if (size.width > 1130) {
              return 30;
            } else if (size.width > 949) {
              return 40;
            } else if (size.width > 600) {
              return 20;
            } else if (size.width > 410) {
              return 18;
            } else if (size.width > 360) {
              return 10;
            } else {
              return 7;
            }
          }),
        )
        .subscribe((len) => (this.sceneNameLen = len)),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
