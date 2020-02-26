import { Component, OnInit, Input } from '@angular/core';

import { map } from 'rxjs/operators';

import { ScreenSizeService } from '@services';

@Component({
  selector: 'app-file-name',
  templateUrl: './file-name.component.html',
  styleUrls: ['./file-name.component.css']
})
export class FileNameComponent implements OnInit {
  @Input() name: string;
  @Input() dataset: string;

  public sceneNameLen: number;

  constructor(
    private screenSize: ScreenSizeService,
  ) { }

  ngOnInit(): void {
    this.screenSize.size$.pipe(
      map(size => {
        if (size.width > 1775) {
          return 32;
        } else if (size.width > 1350) {
          return 20;
        } else {
          return 10;
        }
      }),
    ).subscribe(len => this.sceneNameLen = len);
  }

}
