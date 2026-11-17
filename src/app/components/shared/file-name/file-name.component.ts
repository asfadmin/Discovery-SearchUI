import { Component, inject, input, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { SearchType } from '@models';
import { ScreenSizeService } from '@services';

@Component({
  selector: 'app-file-name',
  templateUrl: './file-name.component.html',
  styleUrls: ['./file-name.component.scss'],
  imports: [TruncateModule],
})
export class FileNameComponent {
  private screenSizeService = inject(ScreenSizeService);

  private screenSize = toSignal(this.screenSizeService.size$);

  public name = input<string>();
  public dataset = input<string>();
  public searchType = input<SearchType>();
  public len = input<number>();

  public SearchTypes = SearchType;
  public sceneNameLen = computed(() => {
    const size = this.screenSize();

    if (this.len()) {
      return this.len();
    }
    if (!this.screenSize()) {
      return;
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
  });
}
