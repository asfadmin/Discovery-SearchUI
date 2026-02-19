import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import { Dataset, DateRange } from '@models';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatCardActions } from '@angular/material/card';
import { DocsModalComponent } from '@components/shared/docs-modal/docs-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { ScreenSizeService } from '@services';
import * as models from '@models';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss'],
  imports: [
    MatIcon,
    MatTooltip,
    NgClass,
    MatCardActions,
    DocsModalComponent,
    TranslateModule,
    AsyncPipe,
  ],
})
export class DatasetComponent {
  @Input() dataset: Dataset;
  @Input() isSelected: boolean;
  @Output() selected: EventEmitter<string> = new EventEmitter<string>();
  private screenSize = inject(ScreenSizeService);

  public detailedDatasetInfoIcon = faInfoCircle;

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  public isReadMore = true;
  public onOpenHelp() {
    window.open(this.dataset.infoUrl);
  }

  public prettyDateRange(dateRange: DateRange): string {
    const { start, end } = dateRange;

    const startYear = start.getFullYear();
    const endYear = !end ? 'Present' : end.getFullYear();

    return startYear === endYear
      ? `${startYear}`.trim()
      : `${startYear} to ${endYear}`.trim();
  }

  public onInfoClicked(e: Event): void {
    e.stopPropagation();
  }
  public onOpenDocs(event, dataset: string) {
    this.trigger.closeMenu();
    this.onSelectionChange(dataset);
    event.stopPropagation();
  }

  public onSelectionChange(dataset: string): void {
    this.selected.emit(dataset);
  }
}
